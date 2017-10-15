pipeline {
    agent {
        docker {
               image 'm4r1ku/angular-cli'
               args '-v /var/run/docker.sock:/var/run/docker.sock'
        }
    }

    stages {
        stage('Prepare') {
            steps {
                sh 'echo "Hello mate"'
            }
        }
    }
}
