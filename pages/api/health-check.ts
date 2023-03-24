import type { NextApiResponse } from 'next'

export default function handler(
  res: NextApiResponse
) {
  return res.status(200).json({ name: 'Aplicação Saudável' })
}
