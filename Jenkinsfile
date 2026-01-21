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

                    sh "ls -lh ${LOCAL_JAR}"

                    sh '''
echo ">>> Kill & clean remote app"
ssh -o StrictHostKeyChecking=no ${VM_USER}@${VM_HOST} << 'EOF'
pkill -f Back-1.0-SNAPSHOT.jar || true
rm -f /home/back/DeployBack/Back-1.0-SNAPSHOT.jar
mkdir -p /home/back/DeployBack
EOF
'''

                    sh """
echo ">>> SCP jar to remote VM"
scp -o StrictHostKeyChecking=no ${LOCAL_JAR} ${VM_USER}@${VM_HOST}:${REMOTE_DIR}/
"""

                    sh """
echo ">>> Start remote app"
ssh -o StrictHostKeyChecking=no ${VM_USER}@${VM_HOST} << 'EOF'
nohup java -jar /home/back/DeployBack/Back-1.0-SNAPSHOT.jar \
> /home/back/DeployBack/app.log 2>&1 &
sleep 2
pgrep -f Back-1.0-SNAPSHOT.jar
EOF
"""
                }
            }
        }
    }
}
