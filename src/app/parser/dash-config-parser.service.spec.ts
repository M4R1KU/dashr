
import {DashConfigParserService} from './dash-config-parser.service';

describe('DashModelParser', () => {
    const parser: DashConfigParserService = new DashConfigParserService();
    const toBaseModel = (apps: any[]) => {
        return {
            apps: apps
        };
    };


    it('parses basic model', () => {
        const obj = toBaseModel([{
            title: 'test',
            shortcut: 'test',
            urlTemplate: 'https://example.com',
            children: []
        }]);

        const result = parser.parseModel(obj);
        expect(result).toEqual(<any>[{
            title: 'test',
            shortcut: 'test',
            url: 'https://example.com',
            children: []
        }]);
    });

    it('parses model with child', () => {
        const obj = toBaseModel([{
            title: 'test',
            shortcut: 'test',
            urlTemplate: 'https://example.com',
            children: [
                {
                    title: 'testChild',
                    shortcut: 'testChild'
                }
            ]
        }]);

        const result = parser.parseModel(obj);
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
        const obj = toBaseModel([{
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
        }]);

        const result = parser.parseModel(obj);
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
        const obj = toBaseModel([{
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
        }]);

        const result = parser.parseModel(obj);
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
        const obj = toBaseModel([
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
        ]);

        const result = parser.parseModel(obj);
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
