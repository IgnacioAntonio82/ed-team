const { app,BrowserWindow,Menu,ipcMain,Notification } = require('electron');

const path = require('path');

const Product = require("./models/Product");

//Main Windows
let mainWindows=null;
function createWindow(){
    mainWindows= new BrowserWindow(
       {width:800,
        height:700,
        webPreferences:{
            nodeIntegration: true,
            enableRemoteModule:true,
            contextIsolation:false
           
        }
    });
   //mainWindows.loadURL("https://www.labrujula24.com/");
   mainWindows.loadFile("src/gui/html/index.html")

   const mainMenu=Menu.buildFromTemplate(template);
   Menu.setApplicationMenu(mainMenu);
   mainWindows.on("close",()=>{app.quit()})
   return mainWindows; // 👈 FALTABA ESTO 
}

//creo un template
const template=[
    {
        label:"File",
        submenu:[
            {
                label:"Productos",
                accelerator: process.platform==="darwin"?"Cmd+p":"Ctrl+p",
                click(){
                    console.log("Hola EDTEAM")
                }
            },
            {
                label:"EJEMPLO"
            },
            {
                label:"Salir",
                accelerator: process.platform==="darwin"?"Cmd+q":"Ctrl+q",
                click(){
                    app.quit()
                }
            }
        ]
    },
    
];

if(process.platform ==="darwin"){//SO MAC
    template.unshift({
        label:app.getName()
    })
} 

//product Windows
let productWindows=null;
function createproductWindows(){
     productWindows=new BrowserWindow({
        width:700,
        height:600,
        webPreferences:{
            nodeIntegration: true,
            enableRemoteModule:true,
            contextIsolation:false
           
        }
    });
    productWindows.loadFile("src/gui/html/create_product.html")
    productWindows.on("close",()=>{productWindows=null})
}

//ipcMain.on("create-product",(event,args)=>{
ipcMain.on("show-create-product",()=>{
     productWindows ===null&&   createproductWindows();
    
   
    // console.log(args) //recivo desde el hijo
    // event.reply("response",args) //envio al hijo
})


ipcMain.on("create-product",async(event,product)=>{
    const newProduct = Product(product);
    await newProduct.save();
    const products = await Product.find();
    mainWindows.webContents.send("new-product", JSON.stringify(products));
    productWindows.close();
    
    //console.log(product) //recivo desde el hijo
     //event.reply("response",product) //envio al hijo
})

// Request all products
ipcMain.on("request-all-products", async () => {
  const products = await Product.find();
  mainWindows.webContents.send("new-product", JSON.stringify(products));
});

// Delete product
ipcMain.on("delete-product", async (e, product_id) => {
  await Product.findByIdAndDelete(product_id);
  const products = await Product.find();
  mainWindows.webContents.send("new-product", JSON.stringify(products));
});

// Get product by id
ipcMain.on("get-product-by-id", async (e, product_id) => {
  const product = await Product.findById(product_id);
  createproductWindows();
  productWindows.webContents.on("did-finish-load", () => {
    productWindows.webContents.send("set-product", JSON.stringify(product));
  });
});


// Update product
ipcMain.on("update-product", async (e, product) => {
  await Product.findByIdAndUpdate(product.id, {
    name: product.name,
    description: product.description,
    price: product.price,
  });
  const products = await Product.find();
  mainWindows.webContents.send("new-product", JSON.stringify(products));
  productWindows.close();
});

// Notifications
ipcMain.on("show-notification", (e, notification) => {
  new Notification({
    title: notification.title,
    body: notification.body
  }).show();
});




module.exports={createWindow};
