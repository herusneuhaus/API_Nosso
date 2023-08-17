using System;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace ConsumingAPI.ApiHelpers
{
    public class MessageSender
    {
        private readonly HttpClient _httpClient;

        public MessageSender()
        {
            _httpClient = new HttpClient();
        }

        public async Task<string> SendMessageAsync(string number, string message)
        {
            string apiUrl = "http://localhost:8000/send-message";

            var content = new StringContent(
                $"{{\"number\": \"{number}\", \"message\": \"{message}\"}}",
                Encoding.UTF8,
                "application/json"
            );

            HttpResponseMessage response = await _httpClient.PostAsync(apiUrl, content);

            if (response.IsSuccessStatusCode)
            {
                return await response.Content.ReadAsStringAsync();
            }
            else
            {
                return "Request failed with status: " + response.StatusCode;
            }
        }
    }
}
