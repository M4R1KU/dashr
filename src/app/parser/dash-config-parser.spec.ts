import {parseModel} from './dash-config-parser';

describe('DashModelParser', () => {
    it('parses basic model', () => {
        const obj = [{
            title: 'test',
            shortcut: 'test',
            urlTemplate: 'https://example.com',
            children: []
        }];

        const result = parseModel(obj);
        expect(result).toEqual(<any>[{
            title: 'test',
            shortcut: 'test',
            url: 'https://example.com',
            children: []
        }]);
    });

    it('parses model with child', () => {
        const obj = [{
            title: 'test',
            shortcut: 'test',
            urlTemplate: 'https://example.com',
            children: [
                {
                    title: 'testChild',
                    shortcut: 'testChild'
                }
            ]
        }];

        const result = parseModel(obj);
        expect(result).toEqual(<any>[{
            title: 'test',
            shortcut: 'test',
            children: [
                {
                    title: 'testChild',
                    shortcut: 'testChild',
                    url: 'https://example.com'
                }
            ]
        }]);
    });

    it('interpolates child url correctly', () => {
        const obj = [{
            title: 'test',
            shortcut: 'test',
            urlTemplate: 'https://{env}example.com',
            children: [
                {
                    title: 'testChild',
                    shortcut: 'testChild',
                    urlParts: {
                        env: 'beta.'
                    }
                }
            ]
        }];

        const result = parseModel(obj);
        expect(result).toEqual(<any>[{
            title: 'test',
            shortcut: 'test',
            children: [
                {
                    title: 'testChild',
                    shortcut: 'testChild',
                    url: 'https://beta.example.com'
                }
            ]
        }]);
    });

    it('works with a big hierarchy', () => {
        const obj = [{
            title: 'test',
            shortcut: 'test',
            urlTemplate: 'https://{env}example.com/{app}/{route}',
            children: [
                {
                    title: 'testChild',
                    shortcut: 'testChild',
                    urlParts: {
                        env: 'beta.'
                    },
                    children: [
                        {
                            title: 'testChildChild',
                            shortcut: 'testChildChild',
                            urlParts: {
                                app: 'base'
                            },
                            children: [
                                {
                                    title: 'testChildChildChild',
                                    shortcut: 'testChildChildChild',
                                    urlParts: {
                                        route: 'child'
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
        }];

        const result = parseModel(obj);
        expect(result).toEqual(<any>[{
            title: 'test',
            shortcut: 'test',
            children: [
                {
                    title: 'testChild',
                    shortcut: 'testChild',
                    children: [
                        {
                            title: 'testChildChild',
                            shortcut: 'testChildChild',
                            children: [
                                {
                                    title: 'testChildChildChild',
                                    shortcut: 'testChildChildChild',
                                    url: 'https://beta.example.com/base/child',
                                }
                            ]
                        }
                    ]
                }
            ]
        }]);
    });

    it('does not fuck up url when key is not available', () => {
        const obj = [
            {
                title: 'test',
                shortcut: 'test',
                urlTemplate: 'https://{env}example.com',
                children: [
                    {
                        title: 'testChild',
                        shortcut: 'testChild',
                        urlParts: {
                            envs: 'beta.'
                        }
                    }
                ]
            }
        ];

        const result = parseModel(obj);
        expect(result).toEqual(<any>[{
            title: 'test',
            shortcut: 'test',
            children: [
                {
                    title: 'testChild',
                    shortcut: 'testChild',
                    url: 'https://example.com'
                }
            ]
        }]);
    });
});
