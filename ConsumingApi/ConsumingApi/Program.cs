using ConsumingAPI.ApiHelpers;
using System;
using System.Threading.Tasks;

class Program
{
    static async Task Main(string[] args)
    {
        var messageSender = new MessageSender();
        var mediaSender = new MediaSender();

        bool exit = false;

        while (true) 
        { 
        Console.WriteLine("Escolha uma ação:");
        Console.WriteLine("1 - Enviar Mensagem");
        Console.WriteLine("2 - Enviar Mídia");
        Console.WriteLine("3 - Sair");
        string choice = Console.ReadLine();

        switch (choice)
        {
            case "1":
                await SendMessageAsync(messageSender);
                break;
            case "2":
                await SendMediaAsync(mediaSender);
                break;
            case "3":
                Console.WriteLine("Encerrando o aplicativo...");
                return;
                default:
                Console.WriteLine("Opção inválida.");
                break;
            }
        }
    }

    static async Task SendMessageAsync(MessageSender messageSender)
    {
        Console.Write("Número do destinatário: ");
        string number = Console.ReadLine();

        Console.Write("Mensagem: ");
        string message = Console.ReadLine();

        string messageResponse = await messageSender.SendMessageAsync(number, message);
        Console.WriteLine("Message Response: " + messageResponse);

        if (messageResponse.Contains("Mensagem enviada"))
        {
            Console.WriteLine("Mensagem Enviada com Sucesso!!");
        }

        else
        {
            Console.WriteLine("Erro ao enviar a mensagem " + messageResponse);
        }
    }

    static async Task SendMediaAsync(MediaSender mediaSender)
    {
        Console.Write("Número do destinatário: ");
        string number = Console.ReadLine();

        Console.Write("Legenda: ");
        string caption = Console.ReadLine();

        Console.Write("Caminho para o arquivo de mídia: ");
        string file = Console.ReadLine();

        string mediaResponse = await mediaSender.SendMediaAsync(number, caption, file);
        Console.WriteLine("Media Response: " + mediaResponse);
    }
}
