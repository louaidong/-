module.exports=  {
  //自定义webpack设置
chainWebpack: config => {
  config.when(process.env.NODE_ENV ==='production',config => {
    config.entry('app').clear().add('./src/main_prod.js')
  })
  config.when(process.env.NODE_ENV ==='development',config => {
    config.entry('app').clear().add('./src/main_dev.js')
  })

}
}
