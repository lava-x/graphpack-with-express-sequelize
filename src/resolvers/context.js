import _ from 'lodash';
import { skip } from 'graphql-resolvers';

/**
 * ========== Check whether user authenticated
 * @param {string / array} roles
 */
const isAuthenticated = (roles = ['user']) => {
  return (root, args, context, info) => {
    if (!context.user) {
      return new Error('Not authenticated');
    }
    // user existing role
    const currentRole = context.user.roles;
    const systemRoles = ['user', 'seller', 'admin', 'manager'];
    // default compare roles
    let compareRoles = ['user'];
    // check input roles whether is string
    if (_.isString(roles)) {
      const anyRole = roles === '*';
      // overwrite compare roles
      compareRoles = anyRole ? systemRoles : [roles];
    }
    // check input roles whether an array and overwrite compare roles
    if (_.isArray(roles) && roles.length > 0) {
      compareRoles = roles;
    }
    // check whether user has role in order to proceed
    if (_.intersection(compareRoles, currentRole).length === 0) {
      return new Error("Don't have permission");
    }
    return skip;
  };
};

const isAdmin = () => {
  return (root, args, context, info) => {
    if (!context.isAdmin) {
      return new Error('Not authenticated');
    }
    return skip;
  };
};

export default {
  isAuthenticated,
  isAdmin,
};
