import { Request, Response } from 'express'
import config from '../config'

const getToken = (req: Request) => {
  if (config.securityMode === config.SECURITY_MODE_JWT) {
    const bearer = req.header('authorization')
    if (bearer) {
      // The header will be in format of `Bearer eyJhbGci...`. We therefore split at the whitespace to get the token
      // itself only.
      let token = bearer.split(' ')[1]
      return token
    }
  }
  return null
}

export function discourseRedirect (req: Request, res: Response) {
  const discourseUrl = process.env.DISCOURSE_URL

  if (discourseUrl) {
    const token = getToken(req)

    if (token) {
      res.redirect(discourseUrl + `/auth/jwt/callback?jwt=${token}`)
      return
    }
  }

  res.status(404).send('Discourse redirect not configured')
}


export function procaDashRedirect (req: Request, res: Response) {
  const procaDashUrl = process.env.PROCA_DASH_URL

  if (procaDashUrl) {
    const token = getToken(req)

    if (token) {
      res.redirect(procaDashUrl + `?jwt=${token}`)
      return
    }
  }

  res.status(404).send('Discourse redirect not configured')
}
