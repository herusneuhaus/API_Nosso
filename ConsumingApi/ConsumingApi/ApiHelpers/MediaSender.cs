using System;
using System.Net.Http;
using System.Threading.Tasks;

namespace ConsumingAPI.ApiHelpers
{
    public class MediaSender
    {
        private readonly HttpClient _httpClient;

        public MediaSender()
        {
            _httpClient = new HttpClient();
        }

        public async Task<string> SendMediaAsync(string number, string caption, string file)
        {
            string apiUrl = "http://localhost:8000/send-media";

            var content = new FormUrlEncodedContent(new Dictionary<string, string>
            {
                { "number", number },
                { "caption", caption },
                { "file", file }
            });

            using (var response = await _httpClient.PostAsync(apiUrl, content))
            {
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
}

