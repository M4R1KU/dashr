pipeline {
    agent {
        docker {
               image 'm4r1ku/docker-angular-cli'
               args '-v /var/run/docker.sock:/var/run/docker.sock -v /opt/yarn/cache:/cache -e "YARN_CACHE_FOLDER=/cache"'
        }
    }

    stages {
        stage('Prepare') {
            steps {
                script {
                    configFileProvider([
                        configFile(fileId: '59d1c401-7bc1-4c14-b8f4-7f0f3aadecd0', targetLocation: 'src/assets/config.json')
                    ]) {}
                }
                sh 'yarn'
            }
        }

        stage('Build') {
            steps {
                sh 'ng build --prod'
            }
        }

        stage('Test') {
            steps {
                sh 'ng test --watch=false --single-run --browser=PhantomJS'
            }
        }

        stage('Docker Push') {
            environment { DOCKER = credentials('docker-deploy') }
            steps {
                sh 'docker login -u "$DOCKER_USR" -p "$DOCKER_PSW" docker.mkweb.me:443'

                sh 'docker build -t docker.mkweb.me:443/dashr:$BUILD_NUMBER -t docker.mkweb.me:443/dashr:latest .'

                sh 'docker push docker.mkweb.me:443/dashr:$BUILD_NUMBER && docker push docker.mkweb.me:443/dashr:latest'
            }
        }
    }
    post {
        always {
            deleteDir()
        }
    }
}
