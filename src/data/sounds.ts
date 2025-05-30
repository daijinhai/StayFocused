import { IconType } from '../components/SoundIcon';

interface SoundData {
  id: string;
  name: string;
  category: string;
  iconType: IconType;
  audioUrl: string;
}

// 判断是否在Electron环境中运行
const isElectron = () => {
  return window.navigator.userAgent.includes('Electron');
};

// 获取正确的音频URL前缀
const getAudioUrlPrefix = () => {
  return isElectron() ? 'app:/' : '';
};

export const sounds: SoundData[] = [

// Nature Category
{
  id: 'forest-birds',
  name: '森林鸟鸣',
  category: '自然',
  iconType: 'forest',
  audioUrl: `${getAudioUrlPrefix()}/sounds/forest-birds.mp3`
},
{
  id: 'waves',
  name: '海浪',
  category: '自然',
  iconType: 'waves',
  audioUrl: `${getAudioUrlPrefix()}/sounds/waves.mp3`
},
{
  id: 'creek',
  name: '溪流',
  category: '自然',
  iconType: 'creek',
  audioUrl: `${getAudioUrlPrefix()}/sounds/creek.mp3`
},
{
  id: 'wind',
  name: '微风',
  category: '自然',
  iconType: 'wind',
  audioUrl: `${getAudioUrlPrefix()}/sounds/wind.mp3`
},
{
  id: 'leaves-rustling',
  name: '树叶沙沙',
  category: '自然',
  iconType: 'leaves',
  audioUrl: `${getAudioUrlPrefix()}/sounds/leaves-rustling.mp3`
},
{
  id: 'waterfall',
  name: '瀑布',
  category: '自然',
  iconType: 'waterfall',
  audioUrl: `${getAudioUrlPrefix()}/sounds/waterfall.mp3`
},
{
  id: 'bonfire',
  name: '篝火',
  category: '自然',
  iconType: 'fire',
  audioUrl: `${getAudioUrlPrefix()}/sounds/bonfire.mp3`
},
{
  id: 'beach',
  name: '海滩',
  category: '自然',
  iconType: 'beach',
  audioUrl: `${getAudioUrlPrefix()}/sounds/beach.mp3`
},
{
  id: 'forest-night',
  name: '夜晚森林',
  category: '自然',
  iconType: 'night-forest',
  audioUrl: `${getAudioUrlPrefix()}/sounds/forest-night.mp3`
},


  // Rain Category
  {
    id: 'rain-light',
    name: '小雨',
    category: '雨声',
    iconType: 'rain-light',
    audioUrl: `${getAudioUrlPrefix()}/sounds/rain-light.mp3`
  },
  {
    id: 'rain-heavy',
    name: '大雨',
    category: '雨声',
    iconType: 'rain-light',
    audioUrl: `${getAudioUrlPrefix()}/sounds/rain-heavy.mp3`
  },
  {
    id: 'rain-roof',
    name: '屋檐雨声',
    category: '雨声',
    iconType: 'rain-roof',
    audioUrl: `${getAudioUrlPrefix()}/sounds/rain-roof.mp3`
  },
  {
    id: 'rain-window',
    name: '窗外雨声',
    category: '雨声',
    iconType: 'rain-window',
    audioUrl: `${getAudioUrlPrefix()}/sounds/rain-window.mp3`
  },
  {
    id: 'rain-thunder',
    name: '雷雨',
    category: '雨声',
    iconType: 'thunder',
    audioUrl: `${getAudioUrlPrefix()}/sounds/rain-thunder.mp3`
  },
  // {
  //   id: 'rain-umbrella',
  //   name: '雨伞声',
  //   category: '雨声',
  //   iconType: 'rain-umbrella',
  //   audioUrl: `${getAudioUrlPrefix()}/sounds/rain-umbrella.mp3`
  // },
  {
    id: 'rain-leaves',
    name: '雨打树叶',
    category: '雨声',
    iconType: 'rain-leaves',
    audioUrl: `${getAudioUrlPrefix()}/sounds/rain-leaves.mp3`
  },
  {
    id: 'rain-puddle',
    name: '雨水潭',
    category: '雨声',
    iconType: 'rain-puddle',
    audioUrl: `${getAudioUrlPrefix()}/sounds/rain-puddle.mp3`
  },


  

  // City Category
  {
    id: 'city-traffic',
    name: '城市交通',
    category: '城市',
    iconType: 'traffic',
    audioUrl: `${getAudioUrlPrefix()}/sounds/city-traffic.mp3`
  },
  {
    id: 'cafe',
    name: '咖啡馆',
    category: '城市',
    iconType: 'cafe',
    audioUrl: `${getAudioUrlPrefix()}/sounds/cafe.mp3`
  },
  {
    id: 'keyboard',
    name: '键盘声',
    category: '城市',
    iconType: 'keyboard',
    audioUrl: `${getAudioUrlPrefix()}/sounds/keyboard.mp3`
  },
  {
    id: 'subway',
    name: '地铁',
    category: '城市',
    iconType: 'subway',
    audioUrl: `${getAudioUrlPrefix()}/sounds/subway.mp3`
  },
  {
    id: 'park',
    name: '公园',
    category: '城市',
    iconType: 'park',
    audioUrl: `${getAudioUrlPrefix()}/sounds/park.mp3`
  },
  {
    id: 'train',
    name: '火车',
    category: '城市',
    iconType: 'train',
    audioUrl: `${getAudioUrlPrefix()}/sounds/train.mp3`
  },

  // // Animals Category
  // {
  //   id: 'birds',
  //   name: '鸟鸣',
  //   category: '动物',
  //   iconType: 'birds',
  //   audioUrl: `${getAudioUrlPrefix()}/sounds/birds.mp3`
  // },
  // {
  //   id: 'crickets',
  //   name: '蟋蟀',
  //   category: '动物',
  //   iconType: 'crickets',
  //   audioUrl: `${getAudioUrlPrefix()}/sounds/crickets.mp3`
  // },
  // {
  //   id: 'frogs',
  //   name: '青蛙',
  //   category: '动物',
  //   iconType: 'frogs',
  //   audioUrl: `${getAudioUrlPrefix()}/sounds/frogs.mp3`
  // },
  // {
  //   id: 'seagulls',
  //   name: '海鸥',
  //   category: '动物',
  //   iconType: 'seagulls',
  //   audioUrl: `${getAudioUrlPrefix()}/sounds/seagulls.mp3`
  // },
  // {
  //   id: 'wolves',
  //   name: '狼嚎',
  //   category: '动物',
  //   iconType: 'wolves',
  //   audioUrl: `${getAudioUrlPrefix()}/sounds/wolves.mp3`
  // },
  // {
  //   id: 'owls',
  //   name: '猫头鹰',
  //   category: '动物',
  //   iconType: 'owls',
  //   audioUrl: `${getAudioUrlPrefix()}/sounds/owls.mp3`
  // },
  // {
  //   id: 'cats',
  //   name: '猫咪',
  //   category: '动物',
  //   iconType: 'cats',
  //   audioUrl: `${getAudioUrlPrefix()}/sounds/cats.mp3`
  // },
  // {
  //   id: 'dolphins',
  //   name: '海豚',
  //   category: '动物',
  //   iconType: 'dolphins',
  //   audioUrl: `${getAudioUrlPrefix()}/sounds/dolphins.mp3`
  // },
  // {
  //   id: 'whales',
  //   name: '鲸鱼',
  //   category: '动物',
  //   iconType: 'whales',
  //   audioUrl: `${getAudioUrlPrefix()}/sounds/whales.mp3`
  // }
];