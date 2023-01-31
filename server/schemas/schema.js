const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
  GraphQLEnumType,
} = require("graphql");

//Mongoose models
const Client = require("../models/Client");
const Project = require("../models/Project");

//Client Type
const ClientsType = new GraphQLObjectType({
  name: "Client",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    phone: { type: GraphQLString },
  }),
});

//Projects Type
const ProjectsType = new GraphQLObjectType({
  name: "Projects",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    status: { type: GraphQLString },
    client: {
      type: ClientsType,
      resolve(parent, args) {
        return Client.findById(parent.clientId);
      },
    },
  }),
});

//Root Query
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    projects: {
      type: new GraphQLList(ProjectsType),
      resolve(parents, args) {
        return Project.find();
      },
    },
    project: {
      type: ProjectsType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Project.findById(args.id);
      },
    },
    clients: {
      type: new GraphQLList(ClientsType),
      resolve(parents, args) {
        return Client.find();
      },
    },
    client: {
      type: ClientsType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Client.findById(args.id);
      },
    },
  },
});

//Mutations
const mutation = new GraphQLObjectType({
  name: "mutation",
  fields: {
    //Add a client
    addClient: {
      type: ClientsType,
      args: {
        name: {
          type: GraphQLNonNull(GraphQLString),
        },
        email: {
          type: GraphQLNonNull(GraphQLString),
        },
        phone: {
          type: GraphQLNonNull(GraphQLString),
        },
      },
      resolve(parent, args) {
        const client = new Client({
          name: args.name,
          email: args.email,
          phone: args.phone,
        });
        return client.save();
      },
    },

    //Delete a client
    deleteClient: {
      type: ClientsType,
      args: {
        id: {
          type: GraphQLNonNull(GraphQLID),
        },
      },
      resolve(parent, args) {
        return Client.findByIdAndRemove(args.id);
      },
    },

    //Add a project
    addProject: {
      type: ProjectsType,
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        description: { type: GraphQLNonNull(GraphQLString) },
        status: {
          type: new GraphQLEnumType({
            name: "ProjectStatus",
            values: {
              new: { value: "Not Started" },
              progress: { value: "In Progress" },
              completed: { value: "Completed" },
            },
          }),
          defaultValue: "Not Started",
        },
        clientId: { type: GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        const project = new Project({
          name: args.name,
          description: args.description,
          status: args.status,
          clientId: args.clientId,
        });
        return project.save();
      },
    },

    //Delete Project
    deleteProject: {
      type: ProjectsType,
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        return Project.findByIdAndDelete(args.id);
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: mutation,
});
