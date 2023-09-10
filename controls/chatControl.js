const Users = require('../models/user');
const Message = require('../models/message');
const Group = require('../models/group')
const Groupmembers = require('../models/groupmemeber')




exports.chatMsg = async (req, res) => {
    // console.log(req.user)
    const message = req.body.message
    const groupid = req.params.groupid
    // const userId = req.params.userId
    // console.log(message)

    let usermsg = await Message.create({
        message: message,
        userId: req.user.id,
        groupId : groupid
    })

    res.status(201).json({ data: usermsg , useremail : req.user.email })
}

exports.getMsg = async (req, res) => {

    console.log('getmsg')
    const userId = req.user.id
    const groupid = req.params.groupId

    const usermsg = await Message.findAll({
        where: { groupId: groupid },
        attributes: ['id', 'message','userId','groupId']
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



    // console.log(groupsUserIsNotAMemberOf)

    res.status(201).json({username : req.user.email ,userId:userId, data: usermsg, groupData: groups, notMemeber: groupsUserIsNotAMemberOf })


}

exports.creategroup = async (req, res) => {
    // console.log("here")
    try {
        const groupname = req.body.groupname
        // console.log(groupname)

        let newGroup = await Group.create({
            group: groupname,
            adminId : req.user.id
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

exports.groupData=async (req,res)=>{

    const {groupId,userId} = req.params
    console.log(groupId)

    const message  = await Message.findAll({
        where : {groupId: +groupId}
    })

    const groupName = await Group.findOne({
        where : {id: +groupId}
    })

    res.status(200).json({message:message , groupName : groupName})
}