// ROS_WebVisualization — Jenkins Pipeline
// 모니터링 프론트(CRA dev server :3000) 이미지 빌드 → Harbor push → autonomous ns 배포.
// 빌드 관례는 ../AIBootcamp/Jenkinsfile 참고:
//   - agent any (에이전트 파드에 host docker + docker.sock + kubectl 가 hostPath 로 마운트됨)
//   - docker.withRegistry(..., 'harbor') 의 'harbor' 는 Jenkins 에 등록된 Harbor 크리덴셜 ID
// 앱 소스/Dockerfile 은 websubscriber/ 하위에 있으므로 빌드 컨텍스트는 ./websubscriber.
pipeline {
    agent any

    options {
        timeout(time: 30, unit: 'MINUTES')
        disableConcurrentBuilds()
    }

    parameters {
        booleanParam(name: 'FORCE_DEPLOY', defaultValue: false,
                     description: '브랜치와 무관하게 강제로 빌드·푸시·배포')
    }

    environment {
        REGISTRY  = 'harbor.cu.ac.kr'
        PROJECT   = 'autonomousmonitoring'
        IMAGE     = 'web-visualization'
        NAMESPACE = 'autonomous'
        IMAGE_TAG = "${env.BUILD_NUMBER}"
    }

    stages {
        stage('Checkout') {
            steps { checkout scm }
        }

        // 배포 대상 브랜치: main (그 외 브랜치는 Checkout 만 하고 빌드·배포 스킵).
        stage('Build & Push') {
            when {
                anyOf {
                    branch 'main'
                    expression { return params.FORCE_DEPLOY }
                }
            }
            steps {
                script {
                    def img = docker.build("${REGISTRY}/${PROJECT}/${IMAGE}:${IMAGE_TAG}", "./websubscriber")
                    docker.withRegistry("https://${REGISTRY}", 'harbor') {
                        img.push()
                        img.push('latest')
                    }
                }
            }
        }

        stage('Deploy') {
            when {
                anyOf {
                    branch 'main'
                    expression { return params.FORCE_DEPLOY }
                }
            }
            steps {
                dir('deploy/k8s') {
                    sh '''
                        set -e
                        sed -i 's|newTag: latest|newTag: "'"${IMAGE_TAG}"'"|g' kustomization.yaml
                        kubectl apply -k .
                        kubectl rollout status deploy/web-visualization -n ${NAMESPACE} --timeout=6m
                        echo "Frontend NodePort: $(kubectl get svc web-visualization -n ${NAMESPACE} -o jsonpath='{.spec.ports[0].nodePort}')"
                    '''
                }
            }
        }
    }
}
