# Generated by Django 5.0.4 on 2024-05-04 11:40

import django.db.models.deletion
import uuid
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Chat',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('chat_title', models.CharField(max_length=200)),
                ('url', models.URLField()),
                ('playlist', models.BooleanField(blank=True, default=False, null=True)),
                ('last_chat_id', models.UUIDField(blank=True, null=True)),
                ('status', models.CharField(blank=True, choices=[('training', 'training'), ('trained', 'trained'), ('failed', 'failed')], max_length=200, null=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='chats', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Conversation',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('prompt', models.CharField(max_length=1000)),
                ('video_title', models.CharField(blank=True, max_length=1000, null=True)),
                ('video_id', models.CharField(blank=True, max_length=100, null=True)),
                ('chat', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='user_prompts', to='timestamp_search.chat')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='TimeStamp',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('time_stamp', models.CharField(max_length=1000)),
                ('caption', models.TextField()),
                ('conversation', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='time_stamps', to='timestamp_search.conversation')),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
