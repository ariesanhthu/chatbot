import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

interface User {
  id: string;
  name: string;
  email: string;
  status: string;
  created_at: string;
}

export async function GET() {
  try {
    // Lấy tổng số lượng status cho mỗi user, group by theo status
    const { data: userStatuses, error: statusError } = await supabase
      .from('user_status')
      .select('user_id, status, count, date')
      .order('count', { ascending: false });

    if (statusError) {
      console.error('Error fetching user statuses:', statusError);
      throw statusError;
    }

    // Tính tổng count cho mỗi status của mỗi user và lưu ngày mới nhất
    const userStatusMap = new Map();
    const userLastActiveMap = new Map();

    userStatuses.forEach(record => {
      const key = `${record.user_id}-${record.status}`;
      if (!userStatusMap.has(key)) {
        userStatusMap.set(key, {
          user_id: record.user_id,
          status: record.status,
          total_count: 0
        });
      }
      userStatusMap.get(key).total_count += record.count;

      // Cập nhật lastActive cho user
      if (!userLastActiveMap.has(record.user_id) || 
          new Date(record.date) > new Date(userLastActiveMap.get(record.user_id))) {
        userLastActiveMap.set(record.user_id, record.date);
      }
    });

    // Chuyển map thành array và sắp xếp theo total_count
    const aggregatedStatuses = Array.from(userStatusMap.values())
      .sort((a, b) => b.total_count - a.total_count);

    // Lấy status có tổng count cao nhất cho mỗi user
    const userMaxStatus = new Map();
    aggregatedStatuses.forEach(record => {
      if (!userMaxStatus.has(record.user_id) || 
          userMaxStatus.get(record.user_id).total_count < record.total_count) {
        userMaxStatus.set(record.user_id, record);
      }
    });

    console.log("Aggregated user statuses: ", Array.from(userMaxStatus.values()));

    // Cập nhật status mới và lastActive vào bảng users
    for (const [userId, statusData] of userMaxStatus) {
      const lastActive = userLastActiveMap.get(userId);
      const { error: updateError } = await supabase
        .from('users')
        .update({ 
          status: statusData.status,
          created_at: lastActive // Cập nhật lastActive
        })
        .eq('id', userId);

      if (updateError) {
        console.error(`Error updating status for user ${userId}:`, updateError);
      }
    }

    // Lấy thông tin đã cập nhật của tất cả users
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select(`
        id,
        name,
        email,
        status,
        created_at
      `);

    if (usersError) {
      console.error('Error fetching users:', usersError);
      throw usersError;
    }

    // Chuyển đổi dữ liệu thành định dạng mong muốn
    const formattedData = (users as User[]).map(user => ({
      id: user.id,
      name: user.name,
      status: user.status || 'tốt',
      lastActive: formatLastActive(user.created_at),
      interactions: 0
    }));

    return NextResponse.json({
      students: formattedData
    });

  } catch (error) {
    console.error('Error in dashboard data processing:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error },
      { status: 500 }
    );
  }
}

function formatLastActive(lastActive: string | null): string {
  if (!lastActive) return 'Chưa có hoạt động';
  
  const lastActiveDate = new Date(lastActive);
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - lastActiveDate.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'Vừa xong';
  if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} giờ trước`;
  return `${Math.floor(diffInMinutes / 1440)} ngày trước`;
}
