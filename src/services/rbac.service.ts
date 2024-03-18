import httpStatus from 'http-status'
import { ResourceModel } from '~/models/account/resource.model'
import { UserRoleModel } from '~/models/account/role.model'
import { ApiError } from '~/utils/api-error.util'

/**
 * new resource
 * @param {string} name
 * @param {string} slug
 * @param {string} description
 * */
export const createResource = async ({
  name,
  slug,
  description
}: {
  name: string
  slug: string
  description: string
}) => {
  try {
    if (!name || !description) throw new ApiError(httpStatus.BAD_REQUEST, 'Missing required fields')

    const resource = await ResourceModel.create({ name, slug, description })

    return resource
  } catch (error) {
    throw new ApiError(error.statusCode || httpStatus.INTERNAL_SERVER_ERROR, error.message)
  }
}

export const resourceList = async ({
  userId,
  limit = 30,
  offset = 0,
  search = ''
}: {
  userId: string
  limit?: number
  offset?: number
  search?: string
}) => {
  try {
    const resources = await ResourceModel.aggregate([
      {
        $project: {
          _id: 0,
          name: 1,
          slug: 1,
          description: 1,
          resourceId: '$_id',
          createdAt: 1
        }
      }
    ])
      .skip(offset)
      .limit(limit)

    return resources
  } catch (error) {
    console.log(error)
    return []
  }
}

export const createRole = async ({
  name,
  description,
  slug,
  grants = []
}: {
  name: string
  description: string
  slug: string
  grants?: any[]
}) => {
  try {
    const roles = await UserRoleModel.create({ name, slug, description, grants })

    return roles
  } catch (error) {
    throw new ApiError(error.statusCode || httpStatus.INTERNAL_SERVER_ERROR, error.message)
  }
}

export const roleList = async ({
  userId,
  limit = 30,
  offset = 0,
  search = ''
}: {
  userId: string
  limit?: number
  offset?: number
  search?: string
}) => {
  try {
    const roles = await UserRoleModel.aggregate([
      {
        $unwind: '$grants'
      },
      {
        $lookup: {
          from: 'resources',
          localField: 'grants.resource',
          foreignField: '_id',
          as: 'grants.resource'
        }
      },
      {
        $unwind: '$grants.resource'
      },
      {
        $unwind: '$grants.actions'
      },
      {
        $project: {
          _id: 0,
          role: '$name',
          resource: '$grants.resource.name',
          action: '$grants.actions',
          attributes: '$grants.attributes'
        }
      }
    ])
      .skip(offset)
      .limit(limit)

    return roles
  } catch (error) {
    throw new ApiError(error.statusCode || httpStatus.INTERNAL_SERVER_ERROR, error.message)
  }
}
