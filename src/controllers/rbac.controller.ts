import { Request, Response } from 'express'
import { createResource, createRole, resourceList, roleList } from '~/services/rbac.service'

/**
 * @desc Create a new role
 * @param {string} name
 * @param {string} description
 * @param {string} slug
 * @param {*[]} grants
 * */
export const newRole = async (req: Request, res: Response) => {
  const data = await createRole(req.body)
  res.status(200).json({
    message: 'Create new role successfully',
    data
  })
}

/**
 * @desc Create a new resource
 * @param {string} name
 * @param {string} slug
 * @param {string} description
 * */
export const newResource = async (req: Request, res: Response) => {
  const data = await createResource(req.body)
  res.status(200).json({
    message: 'Create new resource successfully',
    data
  })
}

/**
 * @desc Get all resources
 * */
export const getResources = async (req: Request, res: Response) => {
  const data = await resourceList({
    userId: req.user._id
  })
  res.status(200).json({
    message: 'Get all resources successfully',
    data
  })
}

/**
 * @desc Get all roles
 * */
export const getRoles = async (req: Request, res: Response) => {
  const data = await roleList({
    userId: req.user._id
  })
  res.status(200).json({
    message: 'Get all roles successfully',
    data
  })
}
