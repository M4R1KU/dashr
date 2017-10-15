pipeline {
    agent {
        docker {
               image 'm4r1ku/docker-angular-cli'
               args '-v /var/run/docker.sock:/var/run/docker.sock'
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
    }
}
