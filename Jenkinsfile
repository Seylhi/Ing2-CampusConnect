pipeline {
    agent any
 
    environment {
        SSH_HOST = '172.31.253.207'
        SSH_USER = 'back'
        DEPLOY_DIR = '/home/back'
        FRONT_HOST = '172.31.250.98'
        FRONT_USER = 'front'
        FRONT_DEPLOY_DIR = '/home/front/DeployFront'        
    }
 
    stages {
        
 
        stage('Build Backend') {
            steps {
                dir('Back') {
            sh 'mvn clean package spring-boot:repackage -DskipTests'
                }
            }
        }
 
        stage('Build Frontend') {
            steps {
                dir('Front') {
                    sh 'npm install'
                    sh 'CI= npm run build'
                }
            }
        }
 
        stage('Archive Artifacts') {
            steps {
                archiveArtifacts artifacts: 'Back/target/*.jar', fingerprint: true
                archiveArtifacts artifacts: 'Front/build/**', fingerprint: true
            }
        }
 
        stage('Deploy to VMs') {
            steps {

                sshagent(credentials: ['back-ssh-key']) {
                    sh """
                    ssh ${SSH_USER}@${SSH_HOST} "mkdir -p ${DEPLOY_DIR}/backend"
                    """
                    sh """
                    scp Back/target/*.jar ${SSH_USER}@${SSH_HOST}:${DEPLOY_DIR}/backend/
                    """
                }

                sshagent(credentials: ['front-ssh-key']) {
                    sh """
                    ssh -o StrictHostKeyChecking=no ${FRONT_USER}@${FRONT_HOST} mkdir -p ${FRONT_DEPLOY_DIR}/frontend
                    """
                    sh """
                    scp -o StrictHostKeyChecking=no -r Front/build/* ${FRONT_USER}@${FRONT_HOST}:${FRONT_DEPLOY_DIR}/frontend/
                    """
                }
            }
        }

        stage('Start Backend (Integration)') {
            steps {
                sshagent(credentials: ['back-ssh-key']) {
                    sh """
                    ssh ${SSH_USER}@${SSH_HOST} '
                        chmod +x /home/back/start-back.sh
                        /home/back/start-back.sh
                    '
                """
                }
            }
        }

    }
 
    post {
        success {
            echo 'Pipeline exécuté !'
        }
        failure {
            echo 'Échec du pipeline.'
        }
    }
}