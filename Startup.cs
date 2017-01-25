using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Logging;
using System.IO;

namespace tssdk
{
    public class Startup
    {
        public void Configure(IApplicationBuilder app)
        {
            DefaultFilesOptions options = new DefaultFilesOptions();
            options.DefaultFileNames.Clear();
            options.DefaultFileNames.Add("index.min.html");
            app.UseDefaultFiles(options);

            app.UseStaticFiles();

            var listStaticFiles = new ListStaticFiles();

            foreach (var i in listStaticFiles)
            {
                app.UseStaticFiles(
                    new StaticFileOptions()
                    {
                        FileProvider = new PhysicalFileProvider(
                                Path.Combine(
                                    Directory.GetCurrentDirectory(),
                                    i.Key)),
                        RequestPath = new PathString(i.Value)
                    });
            }
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        // For more information on how to configure your application, visit http://go.microsoft.com/fwlink/?LinkID=398940
        public void ConfigureServices(IServiceCollection services)
        {
        }
    }
}