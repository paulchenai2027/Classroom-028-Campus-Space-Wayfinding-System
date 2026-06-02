/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { OriginOption } from './types';

export const ORIGIN_DATA: Record<string, OriginOption> = {
  east: {
    key: 'east',
    label: '东门 (East Gate)',
    distance: 450,
    baseTime: 6.5,
    // Hourly or step-progress curves (10 milestones from start to end)
    anxietyIndex: [10, 15, 25, 45, 75, 80, 50, 40, 20, 5],
    timePoints: [0, 1, 2, 3, 4, 5, 5.5, 6, 6.2, 6.5],
    congestions: [20, 30, 45, 60, 85, 70, 50, 35, 20, 15],
    steps: [
      '从东门（主校门）步入校区，左手边可见大型食堂。',
      '经过食堂侧门（Side Entrance of Cafeteria / Enter 4, Exit 6）时，人群流速减缓，密度较高。',
      '进入中央草坪导视网格区，沿 45° 东北向对角线道路行走。',
      '在第一教学楼东侧入口转入 Wing B 连廊，指示牌字迹在阴影中可能不明显。',
      '进入 1 楼中廊拐角，右手边即为 028 多媒体智慧教室（后门可进入）。'
    ],
    nodes: [
      { x: 740, y: 480, label: '东门起源点' },
      { x: 670, y: 410, label: '食堂侧门' },
      { x: 600, y: 360, label: '中廊枢纽' },
      { x: 550, y: 320, label: '028教室' }
    ]
  },
  south: {
    key: 'south',
    label: '南门 (South Gate)',
    distance: 320,
    baseTime: 4.5,
    anxietyIndex: [12, 18, 30, 32, 40, 35, 28, 20, 10, 5],
    timePoints: [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5],
    congestions: [40, 35, 32, 25, 45, 50, 30, 20, 15, 10],
    steps: [
      '从南门广场进入，迎面可见图书馆喷泉水系。',
      '沿图书馆西侧大理石坡道向上，注意路面有轻微高差。',
      '穿过学术报告厅前广场，抬头可看到高清晰度数字公告屏。',
      '直接步入教学楼南侧主廊，无需进行跨层攀爬。',
      '前行30米，028教室正面印有醒目高亮数字标签。'
    ],
    nodes: [
      { x: 420, y: 540, label: '南门起源点' },
      { x: 420, y: 420, label: '图书馆广场' },
      { x: 480, y: 370, label: '南侧主廊' },
      { x: 550, y: 320, label: '028教室' }
    ]
  },
  west: {
    key: 'west',
    label: '西门 (West Gate)',
    distance: 580,
    baseTime: 8.5,
    anxietyIndex: [15, 22, 45, 55, 68, 85, 90, 75, 40, 10],
    timePoints: [0, 1, 2, 3, 4, 5, 6, 7, 8, 8.5],
    congestions: [25, 30, 55, 68, 72, 85, 45, 30, 25, 10],
    steps: [
      '自西大门迈入，途径开阔的西区运动场。',
      '由宿舍区侧门（Side Entrance of Dormitory / Enter 1, Exit 5）穿行。',
      '此路段林荫茂密且有施工围挡，导视牌容易被树枝遮挡，引起轻度空间迷失。',
      '穿过玻璃天桥下方的物理通道，折向教学区实验楼。',
      '推开双重防火玻璃隔门，踏上半层阶梯，028教室在第三排右手位。'
    ],
    nodes: [
      { x: 80, y: 360, label: '西门起源点' },
      { x: 210, y: 340, label: '宿舍区侧门' },
      { x: 370, y: 260, label: '林荫连廊' },
      { x: 470, y: 280, label: '实验楼过道' },
      { x: 550, y: 320, label: '028教室' }
    ]
  },
  north: {
    key: 'north',
    label: '北门 (North Gate)',
    distance: 210,
    baseTime: 3.0,
    anxietyIndex: [8, 10, 15, 20, 22, 18, 12, 10, 8, 5],
    timePoints: [0, 0.3, 0.6, 1, 1.3, 1.6, 2, 2.3, 2.7, 3],
    congestions: [10, 12, 15, 20, 35, 40, 25, 15, 10, 5],
    steps: [
      '经北门（邻近校办公区）进入，此处车辆流速较慢。',
      '沿着北侧草坪水泥小道走，视觉轴线直视一号教学楼的标志。',
      '一号教学楼北门配有自动无障碍斜坡。',
      '推开发散型玻璃主旋转门，左转进入电梯厅直行。',
      '绕过咨询大厅服务台后，028教室悬挂有浅绿全息数字极简光效牌。'
    ],
    nodes: [
      { x: 200, y: 80, label: '北门起源点' },
      { x: 250, y: 180, label: '行政草坪' },
      { x: 400, y: 240, label: '一教北门大厅' },
      { x: 550, y: 320, label: '028教室' }
    ]
  },
  north_side: {
    key: 'north_side',
    label: '北侧门 (North Side Gate)',
    distance: 280,
    baseTime: 4.0,
    anxietyIndex: [10, 25, 48, 65, 52, 40, 30, 22, 12, 5],
    timePoints: [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 3.8, 4],
    congestions: [15, 45, 75, 80, 55, 30, 20, 15, 12, 8],
    steps: [
      '北侧门进入后直接面朝实验重地及实验室长廊。',
      '推开厚重的合金气密封隔音门，进入生化实验区中庭。',
      '经过食堂后门（Back Door of Cafeteria / Enter 0, Exit 2），此处常有后勤推车，请注意避让。',
      '沿着地面的绿色数字发光地面指引线，步入阶梯连廊。',
      '在教学翼区第一扇木质防火门，推开即至028。'
    ],
    nodes: [
      { x: 480, y: 70, label: '北侧门起源点' },
      { x: 480, y: 160, label: '食堂后门' },
      { x: 510, y: 240, label: '实验中庭' },
      { x: 550, y: 320, label: '028教室' }
    ]
  }
};
