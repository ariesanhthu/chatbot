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
    // Sử dụng supabase client trực tiếp
    // Kiểm tra kết nối Supabase
    const { data: testData, error: testError } = await supabase.from('users').select('count');
    console.log('Test connection:', { testData, testError });

    // Lấy thông tin của tất cả users
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select(`
        id,
        name,
        email,
        status,
        created_at
      `);

    console.log('Users query result:', { users, usersError });

    if (usersError) {
      console.error('Detailed error:', usersError);
      throw usersError;
    }

    // Chuyển đổi dữ liệu thành định dạng mong muốn
    const formattedData = (users as User[]).map(user => ({
      id: user.id,
      name: user.name,
      status: user.status || 'Tốt',
      lastActive: formatLastActive(user.created_at),
      interactions: 0 // Mặc định là 0 vì không có trường này trong bảng users
    }));

    return NextResponse.json({
      students: formattedData
    });

  } catch (error) {
    console.error('Error fetching dashboard data:', error);
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
