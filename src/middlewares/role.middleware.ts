import { AccessControl } from 'accesscontrol'

const grantList = [
  { role: 'admin', resource: 'profile', action: 'read:any', attributes: '* !views' },
  { role: 'shop', resource: 'profile', action: 'read:own', attributes: '*' }
]

export const rbac = new AccessControl(grantList)
