const accountSID = 'AC04799bf88ae585c6fafbe701975abd95'
const token = '910d4fb6565d48500fee1c53c65bd66e'
const client =  require('twilio')(accountSID, token)

export var Twilio = {

    sysNumber: '+15039173579',

    sendMessage: async function(phone, mess){
        client.messages.create({
            to: phone,
            from: this.sysNumber,
            body: mess,
        }).then(message => console.log(message.sid));
    },

}