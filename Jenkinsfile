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
 
        stage('Deploy to Integration VM') {
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

        stage('Start Applications') {
            steps {

                // Start Backend
                sshagent(credentials: ['back-ssh-key']) {
                    sh """
                    echo ">>> Start Backend"
                    ssh -o StrictHostKeyChecking=no back@${SSH_HOST} "/home/back/start-back.sh"
                    """
                }

                // Start Frontend
                sshagent(credentials: ['front-ssh-key']) {
                    sh """
                    echo ">>> Start Frontend"
                    ssh -o StrictHostKeyChecking=no front@${FRONT_HOST} "/home/front/start-front.sh"
                    """
                }
            }
}


    }
 
    post {
        success {
            echo 'Pipeline exécuté avec succès !'
        }
        failure {
            echo 'Échec du pipeline.'
        }
    }
}