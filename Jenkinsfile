pipeline {
    agent any
 
    environment {
        SSH_HOST = '172.31.253.207'
        SSH_USER = 'back'
        DEPLOY_DIR = '/home/back/'
    }
 
    stages {
        
 
        stage('Build Backend') {
            steps {
                dir('Back') {
            sh 'mvn clean package -DskipTests'
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
                sh """
                    ssh ${SSH_USER}@${SSH_HOST} '
                        mkdir -p ${DEPLOY_DIR}/backend
                    '
                """
 
                sh "scp Back/target/*.jar ${SSH_USER}@${SSH_HOST}:${DEPLOY_DIR}/backend/"
 
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