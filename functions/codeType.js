export default function codeType(response, value, msg=''){
    switch (value){
        case 200:
            response.statusCode = 200;
            response.setHeader("Content-Type","application/json");
            break;
        
        case 405:
            response.statusCode = 405;
            response.setHeader("Content-Type","application/json");
            response.json({
                'status': '400',
                'mensagem': msg
            });
            break;
    }
}