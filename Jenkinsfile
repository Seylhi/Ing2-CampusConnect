pipeline {
    agent any

    environment {
        VM_USER = 'back'
        VM_HOST = '172.31.253.207'
        JAR_NAME = 'Back-1.0-SNAPSHOT.jar'
        APP_DIR = '/home/back/DeployBack'
    }

    stages {

        stage('Build backend') {
            steps {
                dir('Back') {
                    sh 'mvn clean package -DskipTests'
                }
            }
        }

        stage('Build frontend') {
            steps {
                dir('Front') {
                    sh 'npm install'
                    sh 'CI=false npm run build'
                }
            }
        }

        stage('Deploy') {
            steps {
                sshagent(credentials: ['back-ssh-key']) {
                    sh """
                        ssh -o StrictHostKeyChecking=no ${VM_USER}@${VM_HOST} '
                            pkill -f ${JAR_NAME} || true
                            rm -f ${APP_DIR}/${JAR_NAME}
                        '
                        scp Back/target/${JAR_NAME} ${VM_USER}@${VM_HOST}:${APP_DIR}/${JAR_NAME}
                        ssh ${VM_USER}@${VM_HOST} '
                            nohup java -jar ${APP_DIR}/${JAR_NAME} > ${APP_DIR}/app.log 2>&1 &
                        '
                    """
                }
            }
        }
    }
    
}