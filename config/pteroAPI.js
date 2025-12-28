const axios = require('axios');
require('dotenv').config();

const pterodactylAPI = axios.create({
  baseURL: process. env.PTERODACTYL_URL,
  headers: {
    'Authorization': `Bearer ${process.env.PTERODACTYL_API_KEY}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Fungsi untuk create server di Pterodactyl
const createServer = async (userId, serverName, ramMB, nodeId) => {
  try {
    const response = await pterodactylAPI.post('/api/application/servers', {
      external_id: `user_${userId}`,
      name: serverName,
      user_id: userId,
      egg_id: 1,
      docker_image: 'ghcr.io/pterodactyl/yolks:java_17',
      startup:  'java -Xmx{{SERVER_MEMORY}}M -Xms128M -jar {{SERVER_JARFILE}} nogui',
      environment: {
        SERVER_JARFILE: 'server.jar',
        SERVER_MEMORY: ramMB
      },
      limits: {
        memory: ramMB,
        swap: 0,
        disk: 5000,
        io: 500,
        cpu: 200
      },
      feature_limits: {
        databases: 1,
        allocations: 1,
        backups: 3
      },
      allocation:  {
        default:  1
      },
      deploy: {
        locations: [nodeId]
      }
    });

    return { success: true, data: response. data };
  } catch (error) {
    console.error('Error creating server:', error. response?.data || error.message);
    return { success: false, error: error. message };
  }
};

// Fungsi untuk delete server di Pterodactyl
const deleteServer = async (serverId) => {
  try {
    await pterodactylAPI.delete(`/api/application/servers/${serverId}`);
    return { success: true, message: 'Server deleted successfully' };
  } catch (error) {
    console.error('Error deleting server:', error.response?. data || error.message);
    return { success: false, error:  error.message };
  }
};

// Fungsi untuk get server details
const getServerDetails = async (serverId) => {
  try {
    const response = await pterodactylAPI.get(`/api/application/servers/${serverId}`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error fetching server:', error.response?.data || error.message);
    return { success: false, error: error.message };
  }
};

module.exports = {
  pterodactylAPI,
  createServer,
  deleteServer,
  getServerDetails
};
