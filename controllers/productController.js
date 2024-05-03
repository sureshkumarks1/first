const { Product } = require('../models/productModel')
const { Catagory } = require('../models/catagoryModel')
const upload = require('../middleware/upload')
const sharp = require('sharp');

const loadProd = (req, res)=>{
    //const prod = product.find()
    res.render('product',{"title":"products"})
}

const add_prod = async (req, res) =>{

    const catdata = await Catagory.find({status:true}).select("name _id");

    res.render('add_prod',{"title":"Add Products", category:catdata, errors:''})

}

const updt_prod = async (req,res) =>{

    const filter = { _id: req.body._id };

    let image1, image2, image3;

    const { pname, pdescription, pcategory, productprice, productstock  } = req.body

    let product = {}

    if(req.files.length == 0){
        //console.log("No files")
    
         product = {
            name : pname,
            description : pdescription,
            stock:productstock,
            price:productprice,
            // image:newimg,
            // images:[image1,image2,image3] ,
            category:pcategory
        }


    }
    else{
      

        const filetypeerr = req.files.map((file)=>{
            return file.mimetype!='image/jpeg'?false :true
         })
         
        const catdata = await Catagory.find({status:true}).select("name _id");
     
         if(filetypeerr.includes(false)){
           
            filetype = "File type not allowed"
     
             res.render('add_prod',{"title":"products", errors:filetype,category:catdata })

         }else{

           
            
            

            if(req.body.img0 == 'changedone'){
                 image1 = "http://localhost:3000/uploads/"+req.files[0].filename
            }else{
                image1 = req.body.img0
            }
            
            if(req.body.img1 == 'changedtwo'){
                image2 = "http://localhost:3000/uploads/"+req.files[0].filename
           }else{
            image2 = req.body.img1
           }
           if(req.body.img2 == 'changedthree'){
                image3 = "http://localhost:3000/uploads/"+req.files[0].filename
            }else{
                image3 = req.body.img2
            }

            if(req.body.img1 == 'changedtwo' && req.body.img0 == 'changedone'){
                
                 image1 = "http://localhost:3000/uploads/"+req.files[0].filename
                 image2 = "http://localhost:3000/uploads/"+req.files[1].filename
            }

            if(req.body.img2 == 'changedthree'&&req.body.img1 == 'changedtwo'&&req.body.img0 == 'changedone'){
                 image1 = "http://localhost:3000/uploads/"+req.files[0].filename
                 image2 = "http://localhost:3000/uploads/"+req.files[1].filename
                 image3 = "http://localhost:3000/uploads/"+req.files[2].filename
            }
            
            // try{

            //     let newimg = 'http://localhost:3000/uploads/'+ Date.now()+"-resized.jpg";
                
            //     if(req.body.img0 == 'changedone'){

            //         image1 =req.files[0].path;

            //         // console.log(image1)


            //         await sharp(image1).resize({
            //             width: 634,
            //             height: 811,
            //             fit: 'fill',
            //           }).toFile(newimg);
            //    }  

            //         product = {
            //             name : pname,
            //             description : pdescription,
            //             stock:productstock,
            //             price:productprice,
            //             image:newimg,
            //             images:[image1,image2,image3],
            //             category:pcategory
            //         }
                
            // }catch(err){
            //     console.log("the image name is ", image1)
            //     console.log("There is some issue", err )
            // }
              

            product = {
                name : pname,
                description : pdescription,
                stock:productstock,
                price:productprice,
                image:image1,
                images:[image1,image2,image3],
                category:pcategory
            }
         
     
    //  console.log(product)

        const rest = await Product.updateOne(filter, product);

        //console.log(rest)
        if(rest.acknowledged == true){
           res.redirect('/admin/products')
        }else{
            res.redirect('/admin/products').json({success:false})
        }
        //     // res.status(500).json({error:err, success:false})
         }
   


    }

}

const getProd = async (req, res) => {

    const product_list = await Product.find()

    // console.log(product_list)

     if(!product_list){
         res.status(501).json({success:false}).send()
     }

     res.send({data :product_list }).json();

}

const del_prod = async(req, res) =>{
        
    const filter =  {_id : req.body.id} ;

    const status =  req.body.status 

    const update = {status:status};

    let doc = await Product.findOne({ _id: req.body.id });    

    console.log("This is status", status)

    // Document changed in MongoDB, but not in Mongoose
     await Product.updateOne(filter, {status:status});

    // This will update `status`  to `false`, even though the doc changed.
    doc.status = update.status;
    await doc.save().then(()=>{
        res.send({'message':"success",status:true})
    }).catch((err)=>{
        res.send({'message':"Failed"})
    });
}


const getProdById = async (req, res) =>{
    try {
        const proddata = await Product.findOne({_id:req.body.id});
      //   console.log(catdata.name)
        res.send({data : proddata }).json();  
      }
      catch (error) {
        console.log(error.message);
      }
    }

const edt_prod= async(req, res)=>{

    const id = req.params.id

    try {
        const catdata = await Catagory.find({status:true});
       const proddata = await Product.findOne({_id:id});
      //   console.log(catdata.name)
        // console.log(proddata)
       res.render('edit-prod',{category:catdata,prod:proddata})
      }
      catch (error) {
        console.log(error.message);
      }



    // const update = { status: req.body.status, name:req.body.name };

    // let doc = await Product.findOne({ _id: req.body.id });    

    // // Document changed in MongoDB, but not in Mongoose
    //  await Product.updateOne(filter, { status: update.status, name:update.name});

    // // This will update `status`  to `new status`, even though the doc changed.
    // doc.status = update.status; 
    // doc.name = update.name; 

    // await doc.save().then(()=>{
    //     res.send({'message':"success"})
    // }).catch((err)=>{
    //     res.send({'message':"Failed"})
    // });

}

const insertProd = async (req, res)=>{
    const filetypeerr = req.files.map((file)=>{
       return file.mimetype!='image/jpeg'?false :true
    })
    
    const catdata = await Catagory.find({status:true}).select("name _id");

    if(filetypeerr.includes(false)){
      
            filetype = "File type not allowed"

        res.render('add_prod',{"title":"products", errors:filetype,category:catdata })

    }else{


        const image1 = "http://localhost:3000/uploads/"+req.files[0].path
        const image2 = "http://localhost:3000/uploads/"+req.files[1].path
        const image3 = "http://localhost:3000/uploads/"+req.files[2].path

        const newimg = 'http://localhost:3000/uploads/'+ Date.now()+"-resized.jpg";
        
        await sharp(image1).resize({
            width: 150,
            height: 150,
            fit: 'fill',
          }).toFile(newimg);


        // console.log(image)
        // return
    
        const { pname, pdescription, pcategory, productprice, productstock  } = req.body
    
        const product = new Product({
            name : pname,
            description : pdescription,
            stock:productstock,
            price:productprice,
            image:newimg,
            images:[image1,image2,image3] ,
            category:pcategory
        })
    
        const psaved = await product.updateOne();
        if(psaved){
           res.redirect('/admin/products')
        }else{
            res.status(500).json({error:err, success:false})
        }
    }
}

module.exports = { loadProd, add_prod, getProd, insertProd, del_prod, getProdById, edt_prod, updt_prod }