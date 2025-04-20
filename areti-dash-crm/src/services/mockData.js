// Mock data for development
export const mockContacts = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '555-123-4567',
    company: 'Acme Inc',
    status: 'customer',
    notes: 'Key decision maker',
    createdAt: '2023-01-15T00:00:00.000Z',
    updatedAt: '2023-04-20T00:00:00.000Z'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '555-987-6543',
    company: 'Beta Corp',
    status: 'lead',
    notes: 'Interested in premium plan',
    createdAt: '2023-02-10T00:00:00.000Z',
    updatedAt: '2023-04-21T00:00:00.000Z'
  },
  {
    id: '3',
    name: 'Michael Johnson',
    email: 'michael@example.com',
    phone: '555-555-5555',
    company: 'XYZ Industries',
    status: 'opportunity',
    notes: 'Following up in 2 weeks',
    createdAt: '2023-03-05T00:00:00.000Z',
    updatedAt: '2023-04-19T00:00:00.000Z'
  }
];

export const mockTasks = [
  {
    id: '1',
    title: 'Call John about renewal',
    description: 'Discuss renewal options and potential upsell',
    dueDate: '2023-05-15T00:00:00.000Z',
    priority: 'high',
    status: 'pending',
    contactId: '1',
    createdAt: '2023-04-10T00:00:00.000Z',
    updatedAt: '2023-04-10T00:00:00.000Z'
  },
  {
    id: '2',
    title: 'Send proposal to Jane',
    description: 'Prepare and send custom pricing proposal',
    dueDate: '2023-05-05T00:00:00.000Z',
    priority: 'medium',
    status: 'in-progress',
    contactId: '2',
    createdAt: '2023-04-12T00:00:00.000Z',
    updatedAt: '2023-04-18T00:00:00.000Z'
  },
  {
    id: '3',
    title: 'Update CRM documentation',
    description: 'Add new features to the documentation',
    dueDate: '2023-05-20T00:00:00.000Z',
    priority: 'low',
    status: 'completed',
    contactId: null,
    createdAt: '2023-04-05T00:00:00.000Z',
    updatedAt: '2023-04-15T00:00:00.000Z'
  }
];

export const mockOrganizations = [
  {
    id: '1',
    name: 'Acme Inc',
    industry: 'Technology',
    website: 'https://acme.example.com',
    size: 'medium',
    address: '123 Main St, Anytown, USA',
    notes: 'Established client since 2020',
    createdAt: '2023-01-10T00:00:00.000Z',
    updatedAt: '2023-04-05T00:00:00.000Z'
  },
  {
    id: '2',
    name: 'Beta Corp',
    industry: 'Finance',
    website: 'https://beta.example.com',
    size: 'large',
    address: '456 Broadway, Bigcity, USA',
    notes: 'Potential for multiple departments',
    createdAt: '2023-02-15T00:00:00.000Z',
    updatedAt: '2023-03-20T00:00:00.000Z'
  }
];