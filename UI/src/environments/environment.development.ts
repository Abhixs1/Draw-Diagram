// export const environment = {};
export const environment = {
       msalConfig: {
    auth: {
      clientId: '81a48a00-ae1a-46d6-bf1e-226ffe6073bc',
      // authority: 'https://login.microsoftonline.com/a8a7b605-8a76-4f0a-9282-a2c079c0b926',
      authority: 'https://login.microsoftonline.com/common',
      redirectUri: 'https://casualcommits.azurewebsites.net',
      postLogoutRedirectUri: 'https://casualcommits.azurewebsites.net',
    },
  },
  apiConfig: {
    uri: 'https://graph.microsoft.com/v1.0/me',
    scopes: ['user.read'],
  },
};