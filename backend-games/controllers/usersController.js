import Users from "./../models/Users.js";
import bcrypt from 'bcryptjs';

// Registra un nuevo usuario
/*------------------------------------------*/
export const registerUser = async (req, res) => {
    try {
        // Get user input
        const { name, surname, email, password } = req.body;
    
        console.log("registerUser", req.body);

        // Validate user input
        if (!(email && password && name && surname)) {
            res.status(400).json({
                "error":true,
                "message":"All input is required"
            });
        }

        // Check if user already exist. Validate if user exist in our database
        const oldUser = await Users.findOne({ email });
        if (oldUser) {
            //return res.status(409).send("User Already Exist. Please Login");
            return res.status(409).json({
                "error":true,
                "message":"User Already Exist. Please Login"
            });
        }

        //Encrypt user password
        const encryptedPassword = await bcrypt.hash(password, 10);

        // Create user in our database
        const user = await Users.create({
            name,
            surname,
            email: email.toLowerCase(), // sanitize: convert email to lowercase
            password: encryptedPassword,
        });

        // return new user
        res.status(201).json({
            "error":false,
            "message":"Register successful",
            "user":user
        }); 
    } catch (err) {
        console.log(err);
    }
}

// Autentica un nuevo usuario
/*------------------------------------------*/
export const loginUser = async (req, res) => {
    try {
        // Get user input
        const { email, password } = req.body;

        // Validate user input
        if (!(email && password)) {
            //res.status(400).send("All input is required");
            // Con el error 400 informamos que no se ha podido resolver la solicitud
            res.status(400).json(
                {
                    "error":true,
                    "message":"All input is required"
                }
            );
        }
        // Validate if user exist in our database
        const user = await Users.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            // user and password are valid. Send user data
            res.status(200).json({
                "error":false,
                "message":"Login successful",
                "user":user
            }); 
        }else{
            // Password is not valid
            //res.status(400).send("Invalid Credentials");
            res.status(400).json(
                {
                    "error":true,
                    "message":"Invalid Credentials"
                }
            );
        }
        
    } catch (err) {
        console.log(err);
    }
};