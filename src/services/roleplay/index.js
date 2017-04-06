// implement roleplaying mechanism, for an user to be a guest or host
import { Host } from '../../api/host'
import { Guest } from '../../api/guest'

export const asGuest = (res) => (user) => {
  if (user) {
    Guest.findOne({user : user.id}, (err, guest) => {
        if (err) {
          res.status(401).end();
          return null;
        }
        return guest;
    })
  }
  return null
}

export const asHost = (res) => (user) => {
  if (user) {
    Host.findOne({user : user.id}, (err, host) => {
        if (err) {
          res.status(401).end();
          return null;
        }
        return host;
    })
  }
  return null
}