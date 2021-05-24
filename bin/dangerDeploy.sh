#!/bin/bash
echo v$1

docker build . -t shellcodesniper/multitool_api:v$1 -t shellcodesniper/multitool_api:latest

docker push shellcodesniper/multitool_api:latest
docker push shellcodesniper/multitool_api:v$1

# 이하는 옵션이며, 로컬에서 배포 완료시 배포된 태그의 잔여 파일을 지워줌 ( 저장 용량 확보 )
docker rmi -f $(docker images shellcodesniper/multitool_api -q)
