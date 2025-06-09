'use client';

import { MessageSquare, Search, ThumbsUp, User } from 'lucide-react';
import { cn } from '@/lib/animations';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const categories = [
  { name: 'All', count: 156 },
  { name: 'General Discussion', count: 45 },
  { name: 'Treatment Experiences', count: 38 },
  { name: 'Wellness Tips', count: 29 },
  { name: 'Support Groups', count: 44 },
];

const discussions = [
  {
    id: 1,
    title: 'Tips for managing chronic pain',
    author: {
      name: 'Sarah Johnson',
      avatar: 'https://placehold.co/100x100?text=SJ',
    },
    category: 'Treatment Experiences',
    replies: 12,
    likes: 24,
    lastActivity: '2 hours ago',
    excerpt: "I've been dealing with chronic pain for the past year and would love to hear how others manage their symptoms...",
  },
  {
    id: 2,
    title: 'Meditation techniques for stress relief',
    author: {
      name: 'Michael Chen',
      avatar: 'https://placehold.co/100x100?text=MC',
    },
    category: 'Wellness Tips',
    replies: 8,
    likes: 15,
    lastActivity: '5 hours ago',
    excerpt: "I've found that daily meditation has helped me manage my stress levels significantly. Here are some techniques...",
  },
  {
    id: 3,
    title: 'Support group for diabetes management',
    author: {
      name: 'Emily Davis',
      avatar: 'https://placehold.co/100x100?text=ED',
    },
    category: 'Support Groups',
    replies: 20,
    likes: 30,
    lastActivity: '1 day ago',
    excerpt: "Looking to connect with others who are managing diabetes. Let's share our experiences and tips...",
  },
];

export default function CommunityForum() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container py-8">
        {/* Header */}
        <section className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold mb-2">Community Forum</h1>
          <p className="text-muted-foreground">
            Connect with other patients, share experiences, and get support from the community.
          </p>
        </section>

        {/* Search and Categories */}
        <section className="mb-8 animate-slide-in">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search discussions..."
                className="pl-9"
              />
            </div>
            <Button className="whitespace-nowrap">
              <MessageSquare className="h-4 w-4 mr-2" />
              Start Discussion
            </Button>
          </div>
        </section>

        {/* Categories */}
        <section className="mb-8 animate-slide-in">
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {categories.map((category, index) => (
              <Card
                key={index}
                className="hover-lift animate-fade-in cursor-pointer"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-1">{category.name}</h3>
                  <p className="text-sm text-muted-foreground">{category.count} discussions</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Discussions */}
        <section className="animate-slide-in">
          <h2 className="text-2xl font-bold mb-4">Recent Discussions</h2>
          <div className="space-y-4">
            {discussions.map((discussion, index) => (
              <Card
                key={discussion.id}
                className="hover-lift animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Avatar>
                      <AvatarImage src={discussion.author.avatar} />
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h3 className="font-semibold">{discussion.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            Posted by {discussion.author.name} • {discussion.lastActivity}
                          </p>
                        </div>
                        <span className="text-sm font-medium text-primary">{discussion.category}</span>
                      </div>
                      <p className="text-muted-foreground mb-4">{discussion.excerpt}</p>
                      <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm" className="gap-2">
                          <MessageSquare className="h-4 w-4" />
                          {discussion.replies} Replies
                        </Button>
                        <Button variant="ghost" size="sm" className="gap-2">
                          <ThumbsUp className="h-4 w-4" />
                          {discussion.likes} Likes
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Community Guidelines */}
        <section className="mt-12 animate-slide-in">
          <Card>
            <CardHeader>
              <CardTitle>Community Guidelines</CardTitle>
              <CardDescription>Please follow these guidelines to maintain a supportive and respectful community.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <div className="p-1 rounded-full bg-primary/10">
                    <MessageSquare className="h-4 w-4 text-primary" />
                  </div>
                  <span>Be respectful and supportive of other members</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="p-1 rounded-full bg-primary/10">
                    <MessageSquare className="h-4 w-4 text-primary" />
                  </div>
                  <span>Share personal experiences, not medical advice</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="p-1 rounded-full bg-primary/10">
                    <MessageSquare className="h-4 w-4 text-primary" />
                  </div>
                  <span>Maintain privacy and confidentiality</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="p-1 rounded-full bg-primary/10">
                    <MessageSquare className="h-4 w-4 text-primary" />
                  </div>
                  <span>Report inappropriate content</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
} 