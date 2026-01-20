pipeline {
    agent any

    environment {
        VM_USER = "back"
        VM_HOST = "172.31.253.207"
        APP_DIR = "/home/back/DeployBack"
        JAR_NAME = "Back-1.0-SNAPSHOT.jar"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Backend Build') {
            steps {
                dir('Back') {
                    sh 'mvn clean package spring-boot:repackage -DskipTests'
                }
            }
        }

        stage('Frontend Build') {
            steps {
                dir('Front') {
                    sh 'npm install'
                    sh 'npm run build'
                }
            }
        }

        stage('Deploy Backend') {
            steps {
                sshagent(credentials: ['back-ssh-key']) {
                    sh """
                    ssh -o StrictHostKeyChecking=no ${VM_USER}@${VM_HOST} "pkill -f ${JAR_NAME} || true && rm -f ${APP_DIR}/${JAR_NAME}"
                    scp Back/target/${JAR_NAME} ${VM_USER}@${VM_HOST}:${APP_DIR}/${JAR_NAME}
                    ssh -o StrictHostKeyChecking=no ${VM_USER}@${VM_HOST} "nohup java -jar ${APP_DIR}/${JAR_NAME} > ${APP_DIR}/app.log 2>&1 &"
                    """
        }
    }
}

    }
}
    
