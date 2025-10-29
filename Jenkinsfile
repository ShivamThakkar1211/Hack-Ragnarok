pipeline {
    agent any

    tools {
        nodejs "nodejs20" // Make sure Node.js is installed in Jenkins global tools
    }

    environment {
        registryCredential = 'ecr:us-east-2:awscreds'
        appRegistry = "717279704879.dkr.ecr.us-east-1.amazonaws.com/your-nextjs-app"
        LinkFolio = "https://github.com/ShivamThakkar1211/Hack-Ragnarok.git"
    }

    stages {

        stage('Fetch Code') {
            steps {
                git branch: 'v3.0', url: 'https://github.com/your-user/your-nextjs-nodejs-repo.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install' // or 'yarn install'
            }
        }

        stage('Run Tests') {
            steps {
                sh 'npm test' // Jest or Mocha or whatever test framework you're using
            }
        }

        stage('Linting (Optional)') {
            steps {
                sh 'npm run lint' // if you have a lint script (e.g., eslint)
            }
        }

        stage('Sonar Code Analysis') {
            environment {
                scannerHome = tool 'sonar6.2'
            }
            steps {
                withSonarQubeEnv('sonarserver') {
                    sh '''${scannerHome}/bin/sonar-scanner \
                        -Dsonar.projectKey=nextjs-app \
                        -Dsonar.projectName=nextjs-app \
                        -Dsonar.projectVersion=1.0 \
                        -Dsonar.sources=. \
                        -Dsonar.exclusions=node_modules/**,**/*.test.js,**/*.spec.js'''
                }
            }
        }

        stage("Quality Gate") {
            steps {
                timeout(time: 1, unit: 'HOURS') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        stage('Build App') {
            steps {
                sh 'npm run build' // For Next.js or other Node builds
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    dockerImage = docker.build("${appRegistry}:${BUILD_NUMBER}", ".")
                }
            }
        }

        stage('Upload Docker Image') {
            steps {
                script {
                    docker.withRegistry(vprofileRegistry, registryCredential) {
                        dockerImage.push("$BUILD_NUMBER")
                        dockerImage.push('latest')
                    }
                }
            }
        }

    }
}
