const Users = require('../models/user');
const Message = require('../models/message');
const Group = require('../models/group')
const Groupmembers = require('../models/groupmemeber')
const Sequelize = require('sequelize')




exports.chatMsg = async (req, res) => {
    // console.log(req.user)
    try {


        const message = req.body.message
        const sender = req.body.sender
        const groupid = req.params.groupid
        // const userId = req.params.userId
        // console.log(message)

        let usermsg = await Message.create({
            message: message,
            userId: req.user.id,
            groupId: groupid,
            sender: sender
        })

        res.status(201).json({ data: usermsg, useremail: req.user.email })
    } catch (error) {
        console.log(error)
    }
}

exports.getMsg = async (req, res) => {
    try {

        console.log('getmsg')
        const userId = req.user.id
        const groupid = req.params.groupId

        const usermsg = await Message.findAll({
            where: { groupId: groupid },
            attributes: ['id', 'message', 'userId', 'groupId']
        })

        const allGroups = await Group.findAll();

        // Find groups where the user is a member
        const groups = await Group.findAll({
            include: [
                {
                    model: Users,
                    where: {
                        id: userId,
                    },
                    through: {
                        attributes: [], // Exclude join table attributes
                    },
                },
            ],
        });

        // Extract the group IDs of groups the user is a member of
        const userGroupIds = groups.map((group) => group.id);

        // Filter the groups to find those where the user is not a member
        const groupsUserIsNotAMemberOf = allGroups.filter((group) => !userGroupIds.includes(group.id));

    
        res.status(201).json({ username: req.user.name, userId: userId, data: usermsg, groupData: groups, notMemeber: groupsUserIsNotAMemberOf })
    } catch (error) {
        console.log(error)
    }

}

exports.creategroup = async (req, res) => {
    // console.log("here")
    try {
        const groupname = req.body.groupname
        // console.log(groupname)

        let newGroup = await Group.create({
            group: groupname,
            adminId: req.user.id
        })

        const grp = await Groupmembers.create({
            userId: req.user.id,
            groupId: newGroup.id
        })

        res.status(200).json({ groupD: newGroup })
        // console.log(grp)
    } catch (err) { console.log(err) }
}

exports.joinGroup = async (req, res) => {
    try {
        const groupId = req.params.id;

        const grpJoined = await Groupmembers.create({
            userId: req.user.id,
            groupId: groupId
        })

        const groupName = await Group.findOne({
            where: { id: groupId },
            arrtributes: ['group']
        })

        res.status(200).json({ grpJoined: grpJoined, groupName: groupName })
    } catch (err) { console.log(err) }
}

exports.groupData = async (req, res) => {
    try {
        const { groupId, userId } = req.params
        console.log(groupId)

        const message = await Message.findAll({
            where: { groupId: +groupId }
        })

        const groupName = await Group.findOne({
            where: { id: +groupId }
        })

        res.status(200).json({ message: message, groupName: groupName })
    } catch (error) {
        console.log(error)
    }
}

exports.allUsers = async (req,res)=>{
try{
    const userId = req.params.userId

    const users = await Users.findAll({
        where: {
          id: {
            [Sequelize.Op.not]: userId, // Exclude the specified user ID
          },
        },
      });

    // let users = await Users.findAll()
    res.status(200).json({allUsers: users})
} catch (err) { console.log(err) }
}

exports.addMember = async (req,res)=>{
try{
    const {userId , groupId} = req.body

    let result = await Groupmembers.create({
        groupId : groupId,
        userId : userId
    })

    res.status(200).json({msg : 'Added in group'})
} catch (err) { console.log(err) }
}

exports.search = async (req,res)=>{
try{
    const {searchInput} = req.body
    console.log(searchInput)

    const data = await Users.findAll({
        where: {
          [Sequelize.Op.or]: [
            { email: searchInput },
            { name: searchInput },
            { phone: searchInput }
          ]
        }
      })

      console.log(data)

      res.status(200).json({searchDetails : data})
    } catch (err) { console.log(err) }
}