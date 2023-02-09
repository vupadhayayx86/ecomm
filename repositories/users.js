const fs=require('fs')
const crypto=require('crypto')
const util =require('util')
const Repository=require('./repositories')

const scrypt=util.promisify(crypto.scrypt)
class UserRepository extends Repository {

    async create(attrs){
        attrs.id=this.randomId()
        //Adding salt and encrypting the password
        const salt = crypto.randomBytes(8).toString('hex')
        const buf = await scrypt(attrs.password,salt,64)

        const records=await this.getAll();
        const record={
            ...attrs,
            password:`${buf.toString('hex')}.${salt}`
        }
        records.push(record)
       await this.writeAll(records)
       return record;
    }

    async comparePasswords(saved,supplied){
        //Saved -> password saved in our database 
        //Supplied -> password given to us by a user trying to sign in
        const [hashed,salt]=saved.split('.')
        let hashedSupplied=await scrypt(supplied,salt,64)

        return hashed===hashedSupplied.toString('hex')
    }
}

module.exports=new UserRepository('users.json')