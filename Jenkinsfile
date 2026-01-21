pipeline {
    agent any

    environment {
        VM_USER = "back"
        VM_HOST = "172.31.253.207"
        BACKEND_DIR = "Back"
        FRONTEND_DIR = "Front"
        JAR_NAME = "Back-1.0-SNAPSHOT.jar"
        REMOTE_DEPLOY_PATH = "/home/back/DeployBack"
    }

    stages {
        stage('Build Backend') {
            steps {
                dir("${BACKEND_DIR}") {
                    sh 'mvn clean package -DskipTests'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir("${FRONTEND_DIR}") {
                    sh 'npm install'
                    sh 'CI=false npm run build'
                }
            }
        }

        stage('Deploy to VM') {
            steps {
                sshagent(credentials: ['back-ssh-key']) {
                    sh """
                    ssh -o StrictHostKeyChecking=no ${VM_USER}@${VM_HOST} '
                        pkill -f ${JAR_NAME} || true
                        rm -f ${REMOTE_DEPLOY_PATH}/${JAR_NAME}
                    '
                    scp ${BACKEND_DIR}/target/${JAR_NAME} ${VM_USER}@${VM_HOST}:${REMOTE_DEPLOY_PATH}/
                    ssh ${VM_USER}@${VM_HOST} '
                        nohup java -jar ${REMOTE_DEPLOY_PATH}/${JAR_NAME} > ${REMOTE_DEPLOY_PATH}/app.log 2>&1 &
                    '
                    """
                }
            }
        }
    }
}