using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace tssdk
{
    public class ListStaticFiles : Dictionary<string, string>
    {
        public ListStaticFiles() : base()
        {
            this.Add("index", "/index");
            this.Add("shared", "/shared");
            this.Add("93", "/93");
            this.Add("94", "/94");
            this.Add("95", "/95");
            this.Add("96", "/96");
        }
    }
}