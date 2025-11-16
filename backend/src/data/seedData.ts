import db from '../config/database';

export const seedTrendsData = () => {
  const trends = [
    // 1990s - Korea (Free content)
    {
      decade: '1990s',
      country: 'korea',
      title: '한국 웹의 태동기',
      description: '1990년대 한국 인터넷은 PC통신에서 웹으로 전환되는 시기였습니다. 천리안, 하이텔, 나우누리 등 PC통신 서비스가 주류를 이루었고, 1990년대 후반 포털 사이트가 등장하기 시작했습니다.',
      websites: JSON.stringify([
        { name: '천리안', url: 'chollian.net', description: 'PC통신 서비스', launch_year: 1992, category: 'PC통신' },
        { name: '하이텔', url: 'hitel.net', description: 'PC통신 서비스', launch_year: 1994, category: 'PC통신' },
        { name: '야후코리아', url: 'yahoo.co.kr', description: '초기 포털', launch_year: 1997, category: '포털' }
      ]),
      design_trends: JSON.stringify(['테이블 레이아웃', 'GIF 애니메이션', '프레임 구조', '방문자 카운터']),
      tech_stack: JSON.stringify(['HTML', 'CGI', 'Perl', 'JavaScript']),
      user_behavior: JSON.stringify(['PC통신 커뮤니티', '게시판 문화', '다운로드 센터', '채팅']),
      market_share: 0,
      is_premium: 0
    },

    // 1990s - USA (Premium content)
    {
      decade: '1990s',
      country: 'usa',
      title: '웹의 탄생과 닷컴 붐',
      description: '1990년대 미국은 월드와이드웹의 탄생지로서, Yahoo, Amazon, eBay 등 현대 인터넷 기업들이 설립되었습니다. 닷컴 버블의 시작이었습니다.',
      websites: JSON.stringify([
        { name: 'Yahoo', url: 'yahoo.com', description: '최초의 웹 디렉토리', launch_year: 1994, category: '포털' },
        { name: 'Amazon', url: 'amazon.com', description: '온라인 서점', launch_year: 1995, category: '이커머스' },
        { name: 'eBay', url: 'ebay.com', description: '온라인 경매', launch_year: 1995, category: '마켓플레이스' },
        { name: 'Google', url: 'google.com', description: '검색 엔진', launch_year: 1998, category: '검색' }
      ]),
      design_trends: JSON.stringify(['텍스트 중심 디자인', '링크 디렉토리', '단순한 로고', '밝은 배경색']),
      tech_stack: JSON.stringify(['HTML', 'CGI', 'Perl', 'Java Applets']),
      user_behavior: JSON.stringify(['웹 서핑', '이메일', '포럼', '채팅방']),
      market_share: 85.3,
      is_premium: 1
    },

    // 2000s - Korea (Free content)
    {
      decade: '2000s',
      country: 'korea',
      title: '포털의 전성시대',
      description: '네이버와 다음이 한국 인터넷을 지배한 시기입니다. 싸이월드 미니홈피, 블로그, 카페 문화가 폭발적으로 성장했습니다.',
      websites: JSON.stringify([
        { name: '네이버', url: 'naver.com', description: '국민 포털', launch_year: 1999, category: '포털' },
        { name: '다음', url: 'daum.net', description: '커뮤니티 포털', launch_year: 1995, category: '포털' },
        { name: '싸이월드', url: 'cyworld.com', description: 'SNS', launch_year: 1999, category: 'SNS' }
      ]),
      design_trends: JSON.stringify(['정보 밀집형 레이아웃', '플래시 애니메이션', '미니홈피 꾸미기', '배경음악']),
      tech_stack: JSON.stringify(['HTML', 'Flash', 'JavaScript', 'ASP/JSP']),
      user_behavior: JSON.stringify(['지식iN 질문', '카페 활동', '미니홈피', '블로그']),
      market_share: 0,
      is_premium: 0
    },

    // 2000s - USA (Premium)
    {
      decade: '2000s',
      country: 'usa',
      title: '웹 2.0과 소셜 미디어 혁명',
      description: 'Facebook, YouTube, Twitter의 등장으로 사용자 생성 콘텐츠와 소셜 네트워킹이 인터넷의 중심이 되었습니다.',
      websites: JSON.stringify([
        { name: 'Facebook', url: 'facebook.com', description: 'SNS', launch_year: 2004, category: 'SNS' },
        { name: 'YouTube', url: 'youtube.com', description: '동영상 공유', launch_year: 2005, category: '미디어' },
        { name: 'Twitter', url: 'twitter.com', description: '마이크로블로깅', launch_year: 2006, category: 'SNS' }
      ]),
      design_trends: JSON.stringify(['웹 2.0 그라데이션', '둥근 모서리', 'AJAX 인터페이스', '반사 효과']),
      tech_stack: JSON.stringify(['AJAX', 'Ruby on Rails', 'PHP', 'MySQL']),
      user_behavior: JSON.stringify(['소셜 네트워킹', '동영상 공유', '블로깅', 'RSS 구독']),
      market_share: 78.5,
      is_premium: 1
    },

    // 2000s - Japan (Premium)
    {
      decade: '2000s',
      country: 'japan',
      title: '모바일 우선 문화',
      description: '일본은 i-mode를 통해 세계 최초로 모바일 인터넷 시대를 열었습니다. 믹시(Mixi) 등 독자적인 SNS 문화가 발전했습니다.',
      websites: JSON.stringify([
        { name: 'Mixi', url: 'mixi.jp', description: '일본형 SNS', launch_year: 2004, category: 'SNS' },
        { name: '2channel', url: '2ch.net', description: '익명 게시판', launch_year: 1999, category: '커뮤니티' },
        { name: 'Rakuten', url: 'rakuten.co.jp', description: '이커머스', launch_year: 1997, category: '쇼핑' }
      ]),
      design_trends: JSON.stringify(['모바일 최적화', '이모티콘 문화', '컬러풀한 UI', '세로 스크롤']),
      tech_stack: JSON.stringify(['i-mode', 'XHTML', 'Java ME', 'PHP']),
      user_behavior: JSON.stringify(['모바일 웹', '익명 게시판', '이모티콘', '갤러피 게임']),
      market_share: 67.2,
      is_premium: 1
    },

    // 2000s - China (Premium)
    {
      decade: '2000s',
      country: 'china',
      title: '중국 인터넷 자급자족',
      description: 'Great Firewall 안에서 바이두, QQ, 타오바오 등 중국 고유의 인터넷 생태계가 구축되었습니다.',
      websites: JSON.stringify([
        { name: 'Baidu', url: 'baidu.com', description: '중국 검색엔진', launch_year: 2000, category: '검색' },
        { name: 'QQ', url: 'qq.com', description: '메신저 포털', launch_year: 1999, category: '메신저' },
        { name: 'Taobao', url: 'taobao.com', description: '이커머스', launch_year: 2003, category: '쇼핑' }
      ]),
      design_trends: JSON.stringify(['정보 과밀 레이아웃', '빨강/금색 사용', '플래시 광고', '팝업']),
      tech_stack: JSON.stringify(['HTML', 'Flash', 'PHP', 'MySQL']),
      user_behavior: JSON.stringify(['QQ 메신저', '온라인 쇼핑', 'MMORPG', '포럼']),
      market_share: 71.8,
      is_premium: 1
    },

    // 2010s - Korea (Free content)
    {
      decade: '2010s',
      country: 'korea',
      title: '모바일 대전환',
      description: '카카오톡 기반의 모바일 생태계가 구축되고, 네이버는 모바일에 최적화된 서비스로 진화했습니다.',
      websites: JSON.stringify([
        { name: '카카오톡', url: 'kakaotalk.com', description: '모바일 메신저', launch_year: 2010, category: '메신저' },
        { name: '네이버 모바일', url: 'm.naver.com', description: '모바일 포털', launch_year: 2010, category: '포털' },
        { name: '쿠팡', url: 'coupang.com', description: '이커머스', launch_year: 2010, category: '쇼핑' }
      ]),
      design_trends: JSON.stringify(['모바일 퍼스트', '플랫 디자인', '카드 UI', '반응형 웹']),
      tech_stack: JSON.stringify(['HTML5', 'React', 'Node.js', 'MongoDB']),
      user_behavior: JSON.stringify(['모바일 쇼핑', '카톡', '웹툰', '배달앱']),
      market_share: 0,
      is_premium: 0
    },

    // 2010s - USA (Premium)
    {
      decade: '2010s',
      country: 'usa',
      title: '모바일과 클라우드 시대',
      description: 'Instagram, Uber, Airbnb 등 모바일 앱 중심의 서비스들이 산업을 재편했습니다. 클라우드 컴퓨팅이 보편화되었습니다.',
      websites: JSON.stringify([
        { name: 'Instagram', url: 'instagram.com', description: '사진 SNS', launch_year: 2010, category: 'SNS' },
        { name: 'Uber', url: 'uber.com', description: '차량 공유', launch_year: 2009, category: '플랫폼' },
        { name: 'Airbnb', url: 'airbnb.com', description: '숙박 공유', launch_year: 2008, category: '플랫폼' }
      ]),
      design_trends: JSON.stringify(['플랫 디자인', '미니멀리즘', '머티리얼 디자인', '인피니트 스크롤']),
      tech_stack: JSON.stringify(['React', 'Angular', 'Node.js', 'AWS']),
      user_behavior: JSON.stringify(['모바일 앱', '공유경제', '스트리밍', '인플루언서']),
      market_share: 82.1,
      is_premium: 1
    },

    // 2020s - Korea (Free content)
    {
      decade: '2020s',
      country: 'korea',
      title: 'AI와 메타버스',
      description: '네이버 하이퍼클로바, 카카오 AI 등 국산 AI 서비스가 등장하고, 메타버스 플랫폼이 성장하고 있습니다.',
      websites: JSON.stringify([
        { name: '네이버 AI', url: 'clova.ai', description: 'AI 서비스', launch_year: 2017, category: 'AI' },
        { name: '제페토', url: 'zepeto.me', description: '메타버스', launch_year: 2018, category: '메타버스' },
        { name: '토스', url: 'toss.im', description: '핀테크', launch_year: 2013, category: '금융' }
      ]),
      design_trends: JSON.stringify(['다크모드', '뉴모피즘', '3D 인터페이스', 'AI 챗봇']),
      tech_stack: JSON.stringify(['Next.js', 'TypeScript', 'GraphQL', 'AI/ML']),
      user_behavior: JSON.stringify(['AI 검색', '메타버스', '간편결제', '숏폼 콘텐츠']),
      market_share: 0,
      is_premium: 0
    },

    // 2020s - USA (Premium)
    {
      decade: '2020s',
      country: 'usa',
      title: 'AI 혁명과 Web3',
      description: 'ChatGPT의 등장으로 AI가 일상화되고, Web3와 메타버스 개념이 확산되고 있습니다.',
      websites: JSON.stringify([
        { name: 'ChatGPT', url: 'openai.com', description: 'AI 챗봇', launch_year: 2022, category: 'AI' },
        { name: 'TikTok', url: 'tiktok.com', description: '숏폼 비디오', launch_year: 2016, category: 'SNS' },
        { name: 'Discord', url: 'discord.com', description: '커뮤니티', launch_year: 2015, category: '커뮤니티' }
      ]),
      design_trends: JSON.stringify(['AI UI', '다크모드', '글래스모피즘', '마이크로인터랙션']),
      tech_stack: JSON.stringify(['AI/ML', 'Web3', 'TypeScript', 'Edge Computing']),
      user_behavior: JSON.stringify(['AI 어시스턴트', '숏폼 비디오', 'NFT', '리모트워크']),
      market_share: 79.3,
      is_premium: 1
    },

    // 1990s - Japan (Premium)
    {
      decade: '1990s',
      country: 'japan',
      title: 'PC통신에서 모바일 인터넷으로',
      description: '일본은 1990년대 후반 NTT DoCoMo의 i-mode를 통해 세계 최초로 모바일 인터넷 시대를 열었습니다. PC 인터넷보다 모바일이 먼저 대중화된 독특한 시장입니다.',
      websites: JSON.stringify([
        { name: 'Nifty-Serve', url: 'nifty.com', description: 'PC통신 서비스', launch_year: 1987, category: 'PC통신' },
        { name: 'Yahoo Japan', url: 'yahoo.co.jp', description: '포털 사이트', launch_year: 1996, category: '포털' },
        { name: 'i-mode', url: 'nttdocomo.co.jp', description: '모바일 인터넷', launch_year: 1999, category: '모바일' }
      ]),
      design_trends: JSON.stringify(['이모티콘 문화', '컴팩트 레이아웃', '모바일 우선', 'ASCII 아트']),
      tech_stack: JSON.stringify(['HTML', 'cHTML', 'Java', 'Perl']),
      user_behavior: JSON.stringify(['모바일 웹', '이메일', '게시판', '전자상거래']),
      market_share: 68.5,
      is_premium: 1
    },

    // 1990s - China (Premium)
    {
      decade: '1990s',
      country: 'china',
      title: '인터넷의 도입기',
      description: '1990년대 중국은 인터넷이 막 도입되기 시작한 시기입니다. 1994년 공식적으로 인터넷에 연결되었고, 후반부에 중국 고유의 웹 서비스들이 등장하기 시작했습니다.',
      websites: JSON.stringify([
        { name: 'NetEase', url: '163.com', description: '포털 및 이메일', launch_year: 1997, category: '포털' },
        { name: 'Sina', url: 'sina.com', description: '뉴스 포털', launch_year: 1998, category: '뉴스' },
        { name: 'Sohu', url: 'sohu.com', description: '검색 포털', launch_year: 1998, category: '포털' }
      ]),
      design_trends: JSON.stringify(['정보 밀집형', '빨강/금색 선호', '한자 타이포그래피', '프레임 레이아웃']),
      tech_stack: JSON.stringify(['HTML', 'CGI', 'Perl', 'ASP']),
      user_behavior: JSON.stringify(['뉴스 읽기', '이메일', 'BBS', '채팅방']),
      market_share: 45.2,
      is_premium: 1
    },

    // 2010s - Japan (Premium)
    {
      decade: '2010s',
      country: 'japan',
      title: '모바일 게임과 라인의 시대',
      description: '스마트폰 보급과 함께 LINE이 폭발적으로 성장했고, 모바일 게임(가챠)이 주요 비즈니스 모델로 자리잡았습니다. 2channel과 같은 익명 커뮤니티가 계속 영향력을 유지했습니다.',
      websites: JSON.stringify([
        { name: 'LINE', url: 'line.me', description: '메신저', launch_year: 2011, category: '메신저' },
        { name: 'Niconico', url: 'nicovideo.jp', description: '동영상 공유', launch_year: 2006, category: '미디어' },
        { name: 'Cookpad', url: 'cookpad.com', description: '레시피 공유', launch_year: 1998, category: '커뮤니티' },
        { name: 'Mercari', url: 'mercari.com', description: '중고거래', launch_year: 2013, category: '마켓플레이스' }
      ]),
      design_trends: JSON.stringify(['스큐어모피즘에서 플랫으로', '캐릭터 마케팅', '가챠 UI', '세로 스크롤']),
      tech_stack: JSON.stringify(['iOS', 'Android', 'Ruby on Rails', 'Objective-C']),
      user_behavior: JSON.stringify(['LINE 스탬프', '모바일 게임', '니코동', '트위터']),
      market_share: 73.8,
      is_premium: 1
    },

    // 2010s - China (Premium)
    {
      decade: '2010s',
      country: 'china',
      title: '모바일 슈퍼앱의 시대',
      description: 'WeChat(위챗)이 메신저를 넘어 슈퍼앱으로 진화하며 모든 생활 서비스를 통합했습니다. 알리바바와 텐센트의 양강 구도가 확립되었고, 모바일 결제가 폭발적으로 성장했습니다.',
      websites: JSON.stringify([
        { name: 'WeChat', url: 'wechat.com', description: '슈퍼앱', launch_year: 2011, category: '메신저' },
        { name: 'Weibo', url: 'weibo.com', description: '마이크로블로그', launch_year: 2009, category: 'SNS' },
        { name: 'Douyin', url: 'douyin.com', description: '숏폼 비디오', launch_year: 2016, category: '미디어' },
        { name: 'Didi', url: 'didiglobal.com', description: '차량 공유', launch_year: 2012, category: '플랫폼' }
      ]),
      design_trends: JSON.stringify(['슈퍼앱 UI', 'QR코드 중심', '빨강 강조', '미니프로그램']),
      tech_stack: JSON.stringify(['WeChat Mini Program', 'React Native', 'Vue.js', 'Alipay SDK']),
      user_behavior: JSON.stringify(['위챗 페이', '라이브 커머스', '숏폼 비디오', '공유 경제']),
      market_share: 89.6,
      is_premium: 1
    },

    // 2020s - Japan (Premium)
    {
      decade: '2020s',
      country: 'japan',
      title: 'DX와 캐시리스 추진',
      description: 'COVID-19을 계기로 디지털 전환(DX)이 가속화되었고, 정부 주도의 캐시리스 결제 보급이 확대되었습니다. 메타버스와 VTuber 문화가 글로벌 트렌드를 선도하고 있습니다.',
      websites: JSON.stringify([
        { name: 'PayPay', url: 'paypay.ne.jp', description: 'QR 결제', launch_year: 2018, category: '금융' },
        { name: 'ZOZOTOWN', url: 'zozo.jp', description: '패션 이커머스', launch_year: 2004, category: '쇼핑' },
        { name: 'Hololive', url: 'hololive.tv', description: 'VTuber', launch_year: 2016, category: '엔터테인먼트' },
        { name: 'BASE', url: 'thebase.in', description: '개인 쇼핑몰', launch_year: 2012, category: '이커머스' }
      ]),
      design_trends: JSON.stringify(['뉴모피즘', 'VTuber UI', '다크모드', '캐시리스 UX']),
      tech_stack: JSON.stringify(['Next.js', 'TypeScript', 'Flutter', 'Unity']),
      user_behavior: JSON.stringify(['QR 결제', 'VTuber 시청', '개인 쇼핑몰', '구독 서비스']),
      market_share: 71.2,
      is_premium: 1
    },

    // 2020s - China (Premium)
    {
      decade: '2020s',
      country: 'china',
      title: '라이브 커머스와 정부 규제',
      description: '라이브 스트리밍을 통한 전자상거래가 주류가 되었고, 빅테크 기업에 대한 정부 규제가 강화되었습니다. TikTok(抖音)이 글로벌 시장을 장악했습니다.',
      websites: JSON.stringify([
        { name: 'TikTok China', url: 'douyin.com', description: '숏폼 비디오', launch_year: 2016, category: 'SNS' },
        { name: 'Pinduoduo', url: 'pinduoduo.com', description: '소셜 커머스', launch_year: 2015, category: '쇼핑' },
        { name: 'Bilibili', url: 'bilibili.com', description: '동영상 커뮤니티', launch_year: 2009, category: '미디어' },
        { name: 'Xiaohongshu', url: 'xiaohongshu.com', description: '라이프스타일 SNS', launch_year: 2013, category: 'SNS' }
      ]),
      design_trends: JSON.stringify(['라이브 커머스 UI', 'AI 추천', '버티컬 비디오', '소셜 쇼핑']),
      tech_stack: JSON.stringify(['AI/ML', 'Vue.js', 'WeChat Ecosystem', '5G']),
      user_behavior: JSON.stringify(['라이브 쇼핑', '숏폼 중독', '커뮤니티 구매', 'AI 추천']),
      market_share: 92.4,
      is_premium: 1
    }
  ];

  const stmt = db.prepare(`
    INSERT INTO trends (
      decade, country, title, description,
      websites, design_trends, tech_stack, user_behavior,
      market_share, is_premium
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  trends.forEach(trend => {
    stmt.run([
      trend.decade,
      trend.country,
      trend.title,
      trend.description,
      trend.websites,
      trend.design_trends,
      trend.tech_stack,
      trend.user_behavior,
      trend.market_share,
      trend.is_premium
    ]);
  });

  stmt.finalize();
  console.log('✅ Trends data seeded successfully');
};
