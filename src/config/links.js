export const defaultLinks = [
  {
    title: '常用',
    links: [
      {
        name: '哔哩哔哩',
        url: 'https://www.bilibili.com',
        icon: 'https://www.bilibili.com/favicon.ico'
      },
      {
        name: 'LinuxDo',
        url: 'https://linux.do/',
        icon: 'https://linux.do/uploads/default/original/3X/9/d/9dd49731091ce8656e94433a26a3ef36062b3994.png'
      },
      {
        name: 'Handsome',
        url: 'https://www.lik.cc',
        icon: 'https://www.lik.cc/upload/logo.png'
      },
      {
        name: '知乎',
        url: 'https://www.zhihu.com',
        icon: 'https://static.zhihu.com/heifetz/favicon.ico'
      },
      {
        name: '微博',
        url: 'https://weibo.com',
        icon: 'https://weibo.com/favicon.ico'
      },
      {
        name: '豆瓣',
        url: 'https://www.douban.com',
        icon: 'https://www.douban.com/favicon.ico'
      }
    ]
  },
  {
    title: '工具',
    links: [
      {
        name: 'GitHub',
        url: 'https://github.com',
        icon: 'https://github.com/favicon.ico'
      },
      {
        name: '腾讯文档',
        url: 'https://docs.qq.com',
        icon: 'https://docs.idqqimg.com/tim/docs/desktop/favicon.ico'
      },
      {
        name: '语雀',
        url: 'https://www.yuque.com',
        icon: 'https://gw.alipayobjects.com/zos/rmsportal/UTjFYEzMSYVwzxIGVhMu.png'
      },
      {
        name: '百度翻译',
        url: 'https://fanyi.baidu.com',
        icon: 'https://fanyi.baidu.com/favicon.ico'
      },
      {
        name: '谷歌翻译',
        url: 'https://translate.google.cn',
        icon: 'https://translate.google.cn/favicon.ico'
      }
    ]
  },
  {
    title: '开发',
    links: [
      {
        name: '掘金',
        url: 'https://juejin.cn',
        icon: 'https://lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web/static/favicons/favicon-32x32.png'
      },
      {
        name: 'Stack Overflow',
        url: 'https://stackoverflow.com',
        icon: 'https://cdn.sstatic.net/Sites/stackoverflow/Img/favicon.ico'
      },
      {
        name: 'MDN',
        url: 'https://developer.mozilla.org',
        icon: 'https://developer.mozilla.org/favicon-48x48.png'
      },
      {
        name: 'npm',
        url: 'https://www.npmjs.com',
        icon: 'https://static.npmjs.com/favicon.ico'
      },
      {
        name: 'V2EX',
        url: 'https://v2ex.com',
        icon: 'https://v2ex.com/favicon.ico'
      }
    ]
  },
  {
    title: '学习',
    links: [
      {
        name: '慕课网',
        url: 'https://www.imooc.com',
        icon: 'https://www.imooc.com/favicon.ico'
      },
      {
        name: '中国大学MOOC',
        url: 'https://www.icourse163.org',
        icon: 'https://www.icourse163.org/favicon.ico'
      },
      {
        name: '菜鸟教程',
        url: 'https://www.runoob.com',
        icon: 'https://www.runoob.com/favicon.ico'
      },
      {
        name: 'LeetCode',
        url: 'https://leetcode.cn',
        icon: 'https://leetcode.cn/favicon.ico'
      }
    ]
  }
]

// 默认图标
export const DEFAULT_ICON = 'https://www.lik.cc/upload/logo.png'

// 获取网站图标
export const getFavicon = async (url) => {
  try {
    const domain = new URL(url).origin
    const iconUrl = `${domain}/favicon.ico`
    
    // 尝试加载图标
    const response = await fetch(iconUrl)
    if (response.ok) {
      return iconUrl
    }
    
    // 如果加载失败，返回默认图标
    return DEFAULT_ICON
  } catch (error) {
    return DEFAULT_ICON
  }
} 