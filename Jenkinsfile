pipeline {
    agent any

    environment {
        VM_USER = "back"
        VM_HOST = "172.31.253.207"
        REMOTE_DIR = "/home/back/DeployBack"
        JAR_NAME = "Back-1.0-SNAPSHOT.jar"
        LOCAL_JAR = "Back/target/${JAR_NAME}"
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
                    sh 'CI=false npm run build'
                }
            }
        }

        stage('Deploy to VM') {
            steps {
                sshagent(credentials: ['back-ssh-key']) {

                    // 1. Affiche le .jar local pour confirmer qu’il existe
                    sh "ls -lh ${LOCAL_JAR}"

                    // 2. Kill + Supprimer le .jar distant
                    sh """
                        echo ">>> Kill & clean remote app"
                        ssh -o StrictHostKeyChecking=no ${VM_USER}@${VM_HOST} \
                        'pkill -f ${JAR_NAME} || true && rm -f ${REMOTE_DIR}/${JAR_NAME}'
                    """

                    // 3. Copier le nouveau .jar
                    sh """
                        echo ">>> SCP jar to remote VM"
                        scp -o StrictHostKeyChecking=no ${LOCAL_JAR} ${VM_USER}@${VM_HOST}:${REMOTE_DIR}/
                    """

                    // 4. Relancer l'app
                    sh """
                        echo ">>> Start remote app"
                        ssh -o StrictHostKeyChecking=no ${VM_USER}@${VM_HOST} \
                        'nohup java -jar ${REMOTE_DIR}/${JAR_NAME} > ${REMOTE_DIR}/app.log 2>&1 &'
                    """
                }
            }
        }
    }
}
