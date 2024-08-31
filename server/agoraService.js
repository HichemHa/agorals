const { RtcTokenBuilder, RtcRole } = require('agora-access-token');

const appId = '296bae9142a84c179c57ab85d154afaf'; // Remplacez par votre App ID
const appCertificate = '2808c48647e94f3c8bbcb97c08449a93'; // Remplacez par votre App Certificate
const channelName = 'testChannel'; // Nom de la chaîne

function generateToken(channelName, uid, role) {
    const expirationTimeInSeconds = 3600; // Durée de validité du jeton
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;
  
    const token = RtcTokenBuilder.buildTokenWithUid(
      appId,
      appCertificate,
      channelName,
      uid,
      role,
      privilegeExpiredTs
    );
  
    return token;
  }
  
  module.exports = { generateToken };