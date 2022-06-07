export default function checkData(request){
    const data = request.body;
    const name  = data.name,
          rg    = data.rg,
          cpf   = data.cpf,
          date  = data.date,
          tel   = data.tel,
          email = data.email,
          city  = data.city,
          uf    = data.uf
    
    return [name, rg, cpf, date, tel, email, city, uf]
}