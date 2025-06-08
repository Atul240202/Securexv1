export const internalAppDetails = {
  WhatsApp: {
    id: 'WhatsApp',
    name: 'WhatsApp',
    icon: 'chat',
    description: 'Messaging app with moderate permissions usage',
    risk: 'Medium',
    riskColor: 'yellow',
    usage: {
      dailyMinutes: 180,
      lastUsed: '2 hours ago',
    },
    permissions: [
      {
        name: 'Camera',
        desc: 'Access to device camera',
        icon: 'camera',
        granted: true,
      },
      {
        name: 'Microphone',
        desc: 'Access to device microphone',
        icon: 'microphone',
        granted: true,
      },
      {
        name: 'Contacts',
        desc: 'Access to device contacts',
        icon: 'account-multiple',
        granted: true,
      },
      {
        name: 'Storage',
        desc: 'Access to device storage',
        icon: 'folder',
        granted: true,
      },
    ],
    suggestions: ['Review camera and microphone permissions regularly'],
  },

  Instagram: {
    id: 'Instagram',
    name: 'Instagram',
    icon: 'camera',
    description: 'Social media app with extensive permission requirements',
    risk: 'High',
    riskColor: 'red',
    usage: {
      dailyMinutes: 220,
      lastUsed: '30 minutes ago',
    },
    permissions: [
      {
        name: 'Camera',
        desc: 'Access to device camera',
        icon: 'camera',
        granted: true,
      },
      {
        name: 'Microphone',
        desc: 'Access to device microphone',
        icon: 'microphone',
        granted: true,
      },
      {
        name: 'Location',
        desc: 'Access to device location',
        icon: 'map-pin',
        granted: true,
      },
      {
        name: 'Contacts',
        desc: 'Access to device contacts',
        icon: 'account-multiple',
        granted: true,
      },
      {
        name: 'Storage',
        desc: 'Access to device storage',
        icon: 'folder',
        granted: true,
      },
    ],
    suggestions: [
      'Limit background location access',
      'Disable microphone access when not needed',
    ],
  },
  Maps: {
    id: 'Maps',
    name: 'Maps',
    icon: 'map',
    description: 'Navigation app with location access',
    risk: 'Low',
    riskColor: 'green',
    usage: {
      dailyMinutes: 60,
      lastUsed: '1 hour ago',
    },
    permissions: [
      {
        name: 'Location',
        desc: 'Access to device location',
        icon: 'map-pin',
        granted: true,
      },
      {
        name: 'Storage',
        desc: 'Access to device storage for map data',
        icon: 'folder',
        granted: true,
      },
    ],
    suggestions: ['Use location only while using the app'],
  },
  BankingApp: {
    id: 'BankingApp',
    name: 'Banking App',
    icon: 'bank',
    description: 'Financial app with sensitive permissions',
    risk: 'High',
    riskColor: 'red',
    usage: {
      dailyMinutes: 30,
      lastUsed: '1 day ago',
    },
    permissions: [
      {
        name: 'Camera',
        desc: 'Access to device camera for scanning checks',
        icon: 'camera',
        granted: true,
      },
      {
        name: 'Contacts',
        desc: 'Access to device contacts for payments',
        icon: 'account-multiple',
        granted: true,
      },
      {
        name: 'Storage',
        desc: 'Access to device storage for transaction records',
        icon: 'folder',
        granted: true,
      },
    ],
    suggestions: ['Enable two-factor authentication for added security'],
  },
  Calculator: {
    id: 'Calculator',
    name: 'Calculator',
    icon: 'calculator',
    description: 'Basic calculator app with minimal permissions',
    risk: 'Low',
    riskColor: 'green',
    usage: {
      dailyMinutes: 15,
      lastUsed: '3 hours ago',
    },
    permissions: [
      {
        name: 'Storage',
        desc: 'Access to device storage for saving calculations',
        icon: 'folder',
        granted: true,
      },
    ],
    suggestions: ['No sensitive permissions, safe to use'],
  },
};

export const permissionsOverview = {
  counts: {critical: 3, moderate: 1, normal: 1},
  groups: [
    {
      level: 'Critical',
      color: 'red',
      permissions: [
        {
          name: 'Camera',
          icon: 'camera',
          desc: 'Access to device camera for photos and videos',
          apps: ['WhatsApp', 'Instagram', 'Banking App'],
        },
        {
          name: 'Location',
          icon: 'map-pin',
          desc: 'Access to device location data',
          apps: ['Instagram', 'Maps'],
        },
        {
          name: 'Microphone',
          icon: 'microphone',
          desc: 'Access to device microphone for audio recording',
          apps: ['WhatsApp', 'Instagram'],
        },
      ],
    },
    {
      level: 'Moderate',
      color: 'yellow',
      permissions: [
        {
          name: 'Contacts',
          icon: 'account-multiple',
          desc: 'Access to device contacts',
          apps: ['WhatsApp', 'Instagram'],
        },
      ],
    },
    {
      level: 'Normal',
      color: 'green',
      permissions: [
        // Add examples if you want
      ],
    },
  ],
};
