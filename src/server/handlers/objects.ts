
import { getFullObjectDetailsByLocation } from '../../objects'

import { badRequest } from 'boom'

export async function show(req) {

  const { location } = req.params

  try {

    return getFullObjectDetailsByLocation({ location })

  } catch(error) {

    console.error(error)

    return badRequest(error)

  }

}

