import { Box } from '@admin-bro/design-system';

const Dashboard = () => (
  <Box variant="grey">
    <Box variant="white">
      { '7 JO' },
    </Box>
    <Box variant="grey" />
    <Box variant="white">
      { '빠른 개발을 위한 어드민 패널 ADMIN-BRO Implement.'}
    </Box>
    <Box variant="grey" />
    <Box variant="white">
      { '서버 개발환경 : BASE [Typescript + Node.js] '}
      <br/><br/>
      { '프레임워크 : BASE [ Koa.js ] MESSAGE BROKER [ Apacke Kafka ]'}
      <br /><br/>
      { '데이터베이스 : [ Mongoose ]'}
    </Box>
  </Box>
);

export default Dashboard;
