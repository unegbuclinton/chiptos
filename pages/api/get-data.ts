// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import PATHS from '@lib/api-paths'




type Data = any

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

  const { contract, asset } = req.body

  if(!contract || !asset){
    res.status(400).json("Contract address and asset id required.")
  }

  const data = await axios.get(PATHS[contract] + asset)
  res.status(200).json(data)
}
